import { Type } from "@google/genai";
import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from "@nestjs/common";

import { ai, model } from "./ai";
import { RecipesService } from "./service/recipes.service";
import { sql } from "./sql";
import type { Recipe } from "./types/recipes.types";

type InventoryPromptItem = {
	inventory_id: string;
	inventory_name: string;
	ingredient_name: string;
	quantity: number;
};

type GeneratedRecipe = {
	name: string;
	content: string;
	cuisine: string;
	time: number;
	ingredients: {
		ingredient_name: string;
		quantity: number;
	}[];
};

@Injectable()
export class AiRecipeService {
	constructor(private readonly recipesService: RecipesService) {}

	async generate(accountId: string): Promise<Recipe> {
		const inventoryItems = await sql<InventoryPromptItem[]>`
			SELECT
				item.InventoryID AS inventory_id,
				inventory.Name AS inventory_name,
				item.IngredientName AS ingredient_name,
				item.Quantity AS quantity
			FROM InventoryItem item
			INNER JOIN AccountOwnsInventory account_inventory
				ON account_inventory.InventoryID = item.InventoryID
			INNER JOIN Inventory inventory
				ON inventory.InventoryID = item.InventoryID
			WHERE account_inventory.AccountID = ${accountId}
			ORDER BY inventory.Name ASC, item.IngredientName ASC;
		`;

		if (inventoryItems.length === 0) {
			throw new BadRequestException(
				"No inventory items found to generate a recipe from",
			);
		}

		try {
			const response = await ai.models.generateContent({
				model,
				contents: [
					{
						text: [
							"Generate one recipe for a recipe app.",
							"Base the recipe on the user's inventory items and prefer using what they already have.",
							"Keep the recipe practical and simple.",
							"Return JSON only.",
							"Inventory items:",
							JSON.stringify(inventoryItems, null, 2),
						].join("\n"),
					},
				],
				config: {
					responseMimeType: "application/json",
					responseSchema: {
						type: Type.OBJECT,
						required: ["name", "content", "cuisine", "time", "ingredients"],
						properties: {
							name: { type: Type.STRING },
							content: { type: Type.STRING },
							cuisine: { type: Type.STRING },
							time: { type: Type.INTEGER },
							ingredients: {
								type: Type.ARRAY,
								items: {
									type: Type.OBJECT,
									required: ["ingredient_name", "quantity"],
									properties: {
										ingredient_name: { type: Type.STRING },
										quantity: { type: Type.INTEGER },
									},
								},
							},
						},
					},
				},
			});

			if (!response.text) {
				throw new Error("Gemini returned an empty response");
			}

			const generatedRecipe = JSON.parse(response.text) as GeneratedRecipe;

			return this.recipesService.create({
				account_id: accountId,
				name: generatedRecipe.name,
				content: generatedRecipe.content,
				cuisine: generatedRecipe.cuisine || null,
				time: generatedRecipe.time,
				ingredients: generatedRecipe.ingredients,
			});
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Unknown Gemini error";

			throw new InternalServerErrorException(
				`Failed to generate recipe with Gemini: ${message}`,
			);
		}
	}
}
