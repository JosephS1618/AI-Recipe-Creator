import { Type } from "@google/genai";
import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from "@nestjs/common";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { ai, model } from "./ai";
import { NormalizedNameMap } from "./ingredients.utils";
import { sql } from "./sql";

const NutrientValueSchema = z
	.number()
	.max(100)
	.min(0)
	.transform((value) => Math.round(value * 100) / 100);

const IngredientItemNameSchema = z
	.string()
	.trim()
	.min(1, "Ingredient name is required");

export const IngredientItemSchema = z.object({
	name: IngredientItemNameSchema,
	carbs: NutrientValueSchema,
	protein: NutrientValueSchema,
	fat: NutrientValueSchema,
});
export const IngredientNameSchema = z.object({
	name: IngredientItemNameSchema,
});
export const IngredientNamesSchema = z.object({
	names: z
		.array(IngredientItemNameSchema)
		.min(1, "At least one ingredient name is required"),
});
export const FrequentlyUsedIngredientSchema = z.object({
	name: IngredientItemNameSchema,
	count: z.string(),
});
const IngredientNutritionBatchSchema = z
	.object({
		ingredients: z.array(IngredientItemSchema).min(1),
	})
	.strict();
export type IngredientItem = z.infer<typeof IngredientItemSchema>;
export type IngredientNames = z.infer<typeof IngredientNamesSchema>;
export type FrequentlyUsedIngredient = z.infer<
	typeof FrequentlyUsedIngredientSchema
>;
export class IngredientItemDto extends createZodDto(IngredientItemSchema) {}
export class IngredientNameDto extends createZodDto(IngredientNameSchema) {}
export class IngredientNamesDto extends createZodDto(IngredientNamesSchema) {}

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

	async frequentlyUsedIngredients(): Promise<FrequentlyUsedIngredient[]> {
		return sql<FrequentlyUsedIngredient[]>`
			SELECT
				ri.IngredientName AS name,
				COUNT(*) AS count
			FROM
				RecipeIngredient ri
			GROUP BY
				ri.IngredientName
			HAVING
				COUNT(*) > (
					SELECT
						AVG(count)
					FROM
						(
							SELECT
								COUNT(*) AS count
							FROM
								RecipeIngredient
							GROUP BY
								IngredientName
						)
				)
			ORDER BY
				count DESC,
				ri.IngredientName ASC;
		`;
	}

	async addByAi(item: Pick<IngredientItem, "name">): Promise<IngredientItem> {
		const [ingredient] = await this.addManyByAi({ names: [item.name] });

		if (!ingredient) {
			throw new InternalServerErrorException(
				"Gemini did not return an ingredient",
			);
		}

		return ingredient;
	}

	async addMissingIngredientsByAi(names: string[]): Promise<{
		createdIngredients: IngredientItem[];
		resolvedNames: string[];
	}> {
		const requestedNames = NormalizedNameMap.uniqueNames(names);

		if (requestedNames.length === 0) {
			throw new BadRequestException("Ingredient name is required");
		}

		const existingIngredientNames = NormalizedNameMap.fromItems(
			await this.list(),
			(ingredient) => ingredient.name,
			(ingredient) => ingredient.name,
		);
		const createdIngredients = await this.addManyByAi({
			names: requestedNames.filter(
				(name) => !existingIngredientNames.has(name),
			),
		});
		const resolvedIngredientNames = existingIngredientNames.clone();

		for (const ingredient of createdIngredients) {
			resolvedIngredientNames.set(ingredient.name, ingredient.name);
		}

		return {
			createdIngredients,
			resolvedNames: requestedNames.map((name) => {
				const resolvedName = resolvedIngredientNames.get(name);

				if (!resolvedName) {
					throw new InternalServerErrorException(
						`Failed to resolve ingredient "${name}"`,
					);
				}

				return resolvedName;
			}),
		};
	}

	private async addManyByAi({
		names,
	}: IngredientNames): Promise<IngredientItem[]> {
		const ingredients = await this.generateNutritionByAi(names);

		for (const ingredient of ingredients) {
			await this.add(ingredient);
		}

		return ingredients;
	}

	private async generateNutritionByAi(
		names: string[],
	): Promise<IngredientItem[]> {
		try {
			const uniqueNames = NormalizedNameMap.uniqueNames(names);

			if (uniqueNames.length === 0) {
				return [];
			}

			const response = await ai.models.generateContent({
				model,
				contents: [
					"Estimate the nutrition values for each ingredient in this list:",
					...uniqueNames.map((name) => `- ${name}`),
					"Return grams of carbs, protein, and fat per 100 g of each ingredient.",
					'Use the exact provided ingredient name in each "name" field.',
					'Return JSON only with an "ingredients" array.',
				].join("\n"),
				config: {
					responseMimeType: "application/json",
					responseSchema: {
						type: Type.OBJECT,
						required: ["ingredients"],
						properties: {
							ingredients: {
								type: Type.ARRAY,
								items: {
									type: Type.OBJECT,
									required: ["name", "carbs", "protein", "fat"],
									properties: {
										name: {
											type: Type.STRING,
											description:
												"Ingredient name copied exactly from the prompt.",
										},
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
						},
					},
				},
			});

			if (!response.text) {
				throw new Error("Gemini returned an empty response");
			}

			const parsed = JSON.parse(response.text);
			const result = IngredientNutritionBatchSchema.safeParse(parsed);

			if (!result.success) {
				throw new Error(
					result.error.issues.map((issue) => issue.message).join(", "),
				);
			}

			const ingredientByName = NormalizedNameMap.fromItems(
				result.data.ingredients,
				(ingredient) => ingredient.name,
				(ingredient) => ingredient,
			);

			return names.map((name) => {
				const matchedIngredient = ingredientByName.get(name);

				if (!matchedIngredient) {
					throw new Error(
						`Gemini did not return nutrition values for "${name}"`,
					);
				}

				return {
					name,
					carbs: matchedIngredient.carbs,
					protein: matchedIngredient.protein,
					fat: matchedIngredient.fat,
				};
			});
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Unknown Gemini error";

			throw new InternalServerErrorException(
				`Failed to generate ingredient values with Gemini: ${message}`,
			);
		}
	}
}
