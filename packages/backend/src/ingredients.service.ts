import { Type } from "@google/genai";
import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from "@nestjs/common";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { ai, model } from "./ai";
import { sql } from "./sql";

const NutrientValueSchema = z
	.number()
	.max(100)
	.nonnegative()
	.transform((value) => Math.round(value * 100) / 100);

export const IngredientItemSchema = z.object({
	name: z.string().trim().min(1, "Ingredient name is required"),
	carbs: NutrientValueSchema,
	protein: NutrientValueSchema,
	fat: NutrientValueSchema,
});
export const IngredientNameSchema = IngredientItemSchema.pick({
	name: true,
});
const IngredientNutritionSchema = IngredientItemSchema.omit({
	name: true,
}).strict();
export type IngredientItem = z.infer<typeof IngredientItemSchema>;
export class IngredientItemDto extends createZodDto(IngredientItemSchema) {}
export class IngredientNameDto extends createZodDto(IngredientNameSchema) {}

@Injectable()
export class IngredientService {
	async add(item: IngredientItem): Promise<void> {
		await sql`
			INSERT INTO Ingredient (Name, Carbs, Protein, Fat)
			VALUES (${item.name}, ${item.carbs}, ${item.protein}, ${item.fat});
		`;
	}

	async remove(item: Pick<IngredientItem, "name">): Promise<void> {
		await sql`
			DELETE FROM Ingredient
			WHERE Name = ${item.name};
		`;
	}

	async edit(item: IngredientItem): Promise<void> {
		await sql`
			UPDATE Ingredient
			SET 
				Carbs = ${item.carbs},
				Protein = ${item.protein},
				Fat = ${item.fat}
			WHERE Name = ${item.name};
		`;
	}

	async list(): Promise<IngredientItem[]> {
		return sql<IngredientItem[]>`
			SELECT * FROM Ingredient ORDER BY Name ASC;
		`;
	}

	async addByAi(item: Pick<IngredientItem, "name">): Promise<IngredientItem> {
		const name = item.name.trim();

		if (!name) {
			throw new BadRequestException("Ingredient name is required");
		}

		const nutrition = await this.generateNutritionByAi(name);
		const ingredient: IngredientItem = {
			name,
			...nutrition,
		};

		await this.add(ingredient);
		return ingredient;
	}

	private async generateNutritionByAi(
		name: string,
	): Promise<Omit<IngredientItem, "name">> {
		try {
			const response = await ai.models.generateContent({
				model,
				contents: [
					`Estimate the nutrition values for the ingredient "${name}".`,
					"Return grams of carbs, protein, and fat per 100 g of the ingredient.",
					"Return JSON only with numeric fields carbs, protein, and fat.",
				].join("\n"),
				config: {
					responseMimeType: "application/json",
					responseSchema: {
						type: Type.OBJECT,
						required: ["carbs", "protein", "fat"],
						properties: {
							carbs: {
								type: Type.NUMBER,
								description: "Estimated grams of carbohydrates.",
								minimum: 0,
							},
							protein: {
								type: Type.NUMBER,
								description: "Estimated grams of protein.",
								minimum: 0,
							},
							fat: {
								type: Type.NUMBER,
								description: "Estimated grams of fat.",
								minimum: 0,
							},
						},
					},
				},
			});

			if (!response.text) {
				throw new Error("Gemini returned an empty response");
			}

			const parsed = JSON.parse(response.text);
			const result = IngredientNutritionSchema.safeParse(parsed);

			if (!result.success) {
				throw new Error(
					result.error.issues.map((issue) => issue.message).join(", "),
				);
			}

			return result.data;
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Unknown Gemini error";

			throw new InternalServerErrorException(
				`Failed to generate ingredient values with Gemini: ${message}`,
			);
		}
	}
}
