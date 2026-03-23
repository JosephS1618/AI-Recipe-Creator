import { type ApiResponse, apiClient } from "../request.utils";
import type {
	CreateRecipeInput,
	Recipe,
	RecipeItem,
	UpdateRecipeInput,
} from "../types/recipes.types";

export async function listRecipes(): Promise<RecipeItem[]> {
	const response = await apiClient.get<ApiResponse<RecipeItem[]>>("/recipes");
	return response.data.data;
}

export async function getRecipe(recipeId: string): Promise<Recipe> {
	const response = await apiClient.get<ApiResponse<Recipe>>(
		`/recipe/${recipeId}`,
	);
	return response.data.data;
}

export async function createRecipe(data: CreateRecipeInput): Promise<Recipe> {
	const response = await apiClient.post<ApiResponse<Recipe>>(
		"/recipe/create",
		data,
	);
	return response.data.data;
}

export async function generateAiRecipe(): Promise<Recipe> {
	const response = await apiClient.post<ApiResponse<Recipe>>(
		"/recipe/generate-ai",
	);
	return response.data.data;
}

export async function updateRecipe(data: UpdateRecipeInput): Promise<Recipe> {
	const response = await apiClient.post<ApiResponse<Recipe>>(
		`/recipe/${data.recipe_id}/update`,
		{
			name: data.name,
			content: data.content,
			cuisine: data.cuisine,
			time: data.time,
			ingredients: data.ingredients,
		},
	);
	return response.data.data;
}

export async function deleteRecipe(recipeId: string): Promise<void> {
	const response = await apiClient.post<ApiResponse<void>>(
		`/recipe/${recipeId}/delete`,
	);
	return response.data.data;
}
