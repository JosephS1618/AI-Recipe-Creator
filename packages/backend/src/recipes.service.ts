import { randomUUID } from "node:crypto";
import { Injectable, NotFoundException } from "@nestjs/common";
import type {
	CreateRecipe,
	Recipe,
	RecipeIngredient,
	RecipeItem,
	UpdateRecipe,
} from "./recipes.types";
import { sql } from "./sql";

@Injectable()
export class RecipesService {
	async list(account_id: string): Promise<RecipeItem[]> {
		const recipes = await sql<RecipeItem[]>`
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
			ORDER BY Name ASC;
		`;
		return recipes;
	}

	async listIngredientsUsedInAllRecipes(
		account_id: string,
	): Promise<Pick<RecipeIngredient, "ingredient_name">[]> {
		return sql<Pick<RecipeIngredient, "ingredient_name">[]>`
			SELECT
				i.Name AS ingredient_name
			FROM Ingredient i
			WHERE EXISTS (
				SELECT *
				FROM Recipe r
				WHERE r.AccountID = ${account_id}
			)
			AND NOT EXISTS (
				SELECT *
				FROM Recipe r
				WHERE r.AccountID = ${account_id}
					AND NOT EXISTS (
					SELECT *
					FROM RecipeIngredient ri
					WHERE ri.RecipeID = r.RecipeID
						AND ri.IngredientName = i.Name
				)
			);
		`;
	}

	async get(recipe_id: string): Promise<Recipe> {
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
			WHERE RecipeID = ${recipe_id};
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
				${recipe.cost_in_cents},
				${recipe.time},
				${recipe.cuisine},
				${now},
				${now},
				${recipe.account_id}
			);
		`;

		for (const ingredient of recipe.ingredients) {
			await sql`
				INSERT INTO RecipeIngredient (
					RecipeID,
					IngredientName,
					Quantity
				)
				VALUES (
					${recipe_id},
					${ingredient.ingredient_name},
					${ingredient.quantity}
				);
			`;
		}

		return this.get(recipe_id);
	}

	async update(recipe: UpdateRecipe): Promise<Recipe> {
		const now = new Date().toISOString();

		const [recipeFound] = await sql`
			SELECT RecipeID
			FROM Recipe
			WHERE RecipeID = ${recipe.recipe_id} AND AccountID = ${recipe.account_id};
		`;

		if (!recipeFound) {
			throw new NotFoundException("Recipe not found");
		}

		await sql`
			UPDATE Recipe
			SET
				Name = ${recipe.name},
				Content = ${recipe.content},
				CostInCents = ${recipe.cost_in_cents},
				Time = ${recipe.time},
				Cuisine = ${recipe.cuisine},
				ModificationDate = ${now}
			WHERE RecipeID = ${recipe.recipe_id} AND AccountID = ${recipe.account_id};
		`;

		await sql`
			DELETE FROM RecipeIngredient
			WHERE RecipeID = ${recipe.recipe_id};
		`;

		for (const ingredient of recipe.ingredients) {
			await sql`
				INSERT INTO RecipeIngredient (
					RecipeID,
					IngredientName,
					Quantity
				)
				VALUES (
					${recipe.recipe_id},
					${ingredient.ingredient_name},
					${ingredient.quantity}
				);
			`;
		}

		return this.get(recipe.recipe_id);
	}

	async calculateCalories(recipe_id: string): Promise<number | null> {
		const [result] = await sql<{ total_calories: number | null }[]>`
			SELECT 
				ri.RecipeID,
				SUM(((i.Protein * 4) + (i.Carbs * 4) + (i.Fat * 9)) * ri.Quantity) AS total_calories
			FROM 
				RecipeIngredient ri
			JOIN 
				Ingredient i ON ri.IngredientName = i.Name
			WHERE 
				ri.RecipeID = ${recipe_id}
			GROUP BY 
				ri.RecipeID;
		`;
		return result?.total_calories || null;
	}

	async remove(recipe_id: string, account_id: string): Promise<void> {
		const [recipeFound] = await sql`
			SELECT RecipeID
			FROM Recipe
			WHERE RecipeID = ${recipe_id} AND AccountID = ${account_id};
		`;

		if (!recipeFound) {
			throw new NotFoundException("Recipe not found");
		}

		await sql`
			DELETE FROM Recipe
			WHERE RecipeID = ${recipe_id} AND AccountID = ${account_id};
		`;
	}

	async listWithMinTotalProtein(
		account_id: string,
		target: number,
	): Promise<RecipeItem[]> {
		return sql<RecipeItem[]>`
			SELECT
				r.RecipeID AS recipe_id,
				r.Name AS name,
				r.Content AS content,
				r.Cuisine AS cuisine,
				r.Time AS time,
				r.CostInCents AS cost_in_cents,
				r.CreationDate AS creation_date,
				r.ModificationDate AS modification_date,
				SUM(ri.Quantity * i.Protein) AS total_protein
			FROM
				Recipe r,
				RecipeIngredient ri,
				Ingredient i
			WHERE
				r.RecipeID = ri.RecipeID
				AND r.AccountID = ${account_id}
				AND ri.IngredientName = i.Name
			GROUP BY
				r.RecipeID
			HAVING
				SUM(ri.Quantity * i.Protein) >= ${target};
		`;
	}
}
