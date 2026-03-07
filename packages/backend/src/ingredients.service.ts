import { Injectable } from "@nestjs/common";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { sql } from "./sql";

export const IngredientItemSchema = z.object({
	name: z.string(),
	carbs: z.number(),
	protein: z.number(),
	fat: z.number(),
});
export const IngredientNameSchema = IngredientItemSchema.pick({
	name: true,
});
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
}
