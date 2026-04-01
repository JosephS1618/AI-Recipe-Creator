import { BadRequestException, Injectable } from "@nestjs/common";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

import { ai, model } from "./ai";
import { RecipesService } from "./recipes.service";
import type { Recipe } from "./recipes.types";
import { sql } from "./sql";

type InventoryPromptItem = {
	inventory_id: string;
	inventory_name: string;
	ingredient_name: string;
	quantity: number;
};

const GeneratedRecipeSchema = z.object({
	name: z.string(),
	content: z.string(),
	cost_in_cents: z.number().int(),
	cuisine: z.string(),
	time: z.number().int(),
	ingredients: z.array(
		z.object({
			ingredient_name: z.string(),
			quantity: z.number().int(),
		}),
	),
});

type GeneratedRecipe = z.infer<typeof GeneratedRecipeSchema>;

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

		// https://ai.google.dev/gemini-api/docs/structured-output?example=recipe#javascript_2
		const response = await ai.models.generateContent({
			model,
			contents: [
				{
					text: [
						"Generate one recipe for a recipe app.",
						"Base the recipe on the user's inventory items and prefer using what they already have.",
						"Keep the recipe practical and simple.",
						"Inventory items:",
						JSON.stringify(inventoryItems, null, 2),
					].join("\n"),
				},
			],
			config: {
				responseMimeType: "application/json",
				responseJsonSchema: zodToJsonSchema(GeneratedRecipeSchema),
			},
		});

		if (!response.text) {
			throw new Error("Gemini returned an empty response");
		}

		const generatedRecipe: GeneratedRecipe = GeneratedRecipeSchema.parse(
			JSON.parse(response.text),
		);

		return this.recipesService.create({
			account_id: accountId,
			name: generatedRecipe.name,
			content: generatedRecipe.content,
			cost_in_cents: generatedRecipe.cost_in_cents,
			cuisine: generatedRecipe.cuisine || null,
			time: generatedRecipe.time,
			ingredients: generatedRecipe.ingredients,
		});
	}
}
