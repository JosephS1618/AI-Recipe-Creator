import type {
	CreateRecipeInput,
	ListRecipesQuery,
	Recipe,
	RecipeDivisionIngredient,
	RecipeItem,
	UpdateRecipeInput,
} from "./recipes.types";
import { type ApiResponse, apiClient } from "./request.utils";

export async function listRecipes(
	query: ListRecipesQuery,
): Promise<RecipeItem[]> {
	const response = await apiClient.get<ApiResponse<RecipeItem[]>>("/recipes", {
		params: query,
	});
	return response.data.data;
}

export async function listIngredientsUsedInAllRecipes(): Promise<
	RecipeDivisionIngredient[]
> {
	const response = await apiClient.get<ApiResponse<RecipeDivisionIngredient[]>>(
		"/recipes/ingredients-used-in-all-recipes",
	);
	return response.data.data;
}

export async function getRecipe(recipeId: string): Promise<Recipe> {
	const response = await apiClient.get<ApiResponse<Recipe>>(
		`/recipe/${recipeId}`,
	);
	return response.data.data;
}

export async function getRecipeCalories(
	recipeId: string,
): Promise<number | null> {
	const response = await apiClient.get<ApiResponse<number | null>>(
		`/recipe/${recipeId}/calories`,
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
			cost_in_cents: data.cost_in_cents,
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
