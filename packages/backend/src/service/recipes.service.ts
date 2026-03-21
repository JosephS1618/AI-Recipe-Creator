import { randomUUID } from "node:crypto";
import { Injectable, NotFoundException } from "@nestjs/common";

import { sql } from "../sql";
import type {
	CreateRecipe,
	Recipe,
	RecipeIngredient,
	RecipeItem,
	UpdateRecipe,
} from "../types/recipes.types";

@Injectable()
export class RecipesService {
	async list(account_id: string): Promise<RecipeItem[]> {
		return sql<RecipeItem[]>`
			SELECT
				RecipeID AS recipe_id,
				Name AS name,
				Content AS content,
				Cuisine AS cuisine,
				Time AS time,
				CostInCents AS cost_in_cents,
				CreationDate AS creation_date,
				ModificationDate AS modification_date
			FROM Recipe
			WHERE AccountID = ${account_id}
			ORDER BY ModificationDate DESC, CreationDate DESC;
		`;
	}

	async get(recipe_id: string, account_id: string): Promise<Recipe> {
		const [recipe] = await sql<Recipe[]>`
			SELECT
				RecipeID AS recipe_id,
				AccountID AS account_id,
				Name AS name,
				Content AS content,
				Cuisine AS cuisine,
				Time AS time,
				CostInCents AS cost_in_cents,
				CreationDate AS creation_date,
				ModificationDate AS modification_date
			FROM Recipe
			WHERE RecipeID = ${recipe_id} AND AccountID = ${account_id};
		`;

		if (!recipe) {
			throw new NotFoundException("Recipe not found");
		}

		const ingredients = await sql<RecipeIngredient[]>`
			SELECT
				IngredientName AS ingredient_name,
				Quantity AS quantity
			FROM RecipeIngredient
			WHERE RecipeID = ${recipe_id};
		`;

		return {
			...recipe,
			ingredients,
		};
	}

	async create(recipe: CreateRecipe): Promise<Recipe> {
		const recipe_id = randomUUID();
		const now = new Date().toISOString();

		await sql`
			INSERT INTO Recipe (
				RecipeID,
				Name,
				Content,
				CostInCents,
				Time,
				Cuisine,
				CreationDate,
				ModificationDate,
				AccountID
			)
			VALUES (
				${recipe_id},
				${recipe.name},
				${recipe.content},
				${0},
				${recipe.time},
				${recipe.cuisine},
				${now},
				${now},
				${recipe.account_id}
			);
		`;

		for (const ing of recipe.ingredients) {
			await sql`
				INSERT INTO RecipeIngredient (
					RecipeID,
					IngredientName,
					Quantity
				)
				VALUES (
					${recipe_id},
					${ing.ingredient_name},
					${ing.quantity}
				);
			`;
		}

		return this.get(recipe_id, recipe.account_id);
	}

	async update(recipe: UpdateRecipe): Promise<Recipe> {
		const now = new Date().toISOString();

		const [updated] = await sql`
			UPDATE Recipe
			SET
				Name = ${recipe.name},
				Content = ${recipe.content},
				Time = ${recipe.time},
				Cuisine = ${recipe.cuisine},
				ModificationDate = ${now}
			WHERE RecipeID = ${recipe.recipe_id} AND AccountID = ${recipe.account_id}
			RETURNING RecipeID;
		`;

		if (!updated) {
			throw new NotFoundException("Recipe not found");
		}

		await sql`
			DELETE FROM RecipeIngredient
			WHERE RecipeID = ${recipe.recipe_id};
		`;

		for (const ing of recipe.ingredients) {
			await sql`
				INSERT INTO RecipeIngredient (
					RecipeID,
					IngredientName,
					Quantity
				)
				VALUES (
					${recipe.recipe_id},
					${ing.ingredient_name},
					${ing.quantity}
				);
			`;
		}

		return this.get(recipe.recipe_id, recipe.account_id);
	}

	async remove(recipe_id: string, account_id: string): Promise<void> {
		const [deleted] = await sql`
			DELETE FROM Recipe
			WHERE RecipeID = ${recipe_id} AND AccountID = ${account_id}
			RETURNING RecipeID;
		`;

		if (!deleted) {
			throw new NotFoundException("Recipe not found");
		}
	}
}
