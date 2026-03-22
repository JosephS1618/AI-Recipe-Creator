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
		throw new Error("Need to Implement");
	}

	async get(recipe_id: string): Promise<Recipe> {
		throw new Error("Need to Implement");
	}

	async create(recipe: CreateRecipe): Promise<Recipe> {
		throw new Error("Need to Implement");
	}

	async update(recipe: UpdateRecipe): Promise<Recipe> {
		throw new Error("Need to Implement");
	}

	async remove(recipe_id: string, account_id: string): Promise<void> {
		throw new Error("Need to Implement");
	}
}
