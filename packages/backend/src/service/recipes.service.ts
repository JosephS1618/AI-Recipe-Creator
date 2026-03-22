import { Injectable } from "@nestjs/common";

import type {
	CreateRecipe,
	Recipe,
	RecipeItem,
	UpdateRecipe,
} from "../types/recipes.types";

@Injectable()
export class RecipesService {
	async list(): Promise<RecipeItem[]> {
		throw new Error("Not implemented");
	}

	async get(recipe_id: string): Promise<Recipe> {
		void recipe_id;
		throw new Error("Not implemented");
	}

	async create(recipe: CreateRecipe): Promise<Recipe> {
		void recipe;
		throw new Error("Not implemented");
	}

	async update(recipe: UpdateRecipe): Promise<Recipe> {
		void recipe;
		throw new Error("Not implemented");
	}

	async remove(recipe_id: string, account_id: string): Promise<void> {
		void recipe_id;
		void account_id;
		throw new Error("Not implemented");
	}
}
