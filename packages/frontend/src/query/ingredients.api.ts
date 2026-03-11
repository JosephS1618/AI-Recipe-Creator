import type { IngredientItem } from "./ingredients.types";
import { type ApiResponse, apiClient } from "./request.utils";

export async function getIngredients(): Promise<IngredientItem[]> {
	const response =
		await apiClient.get<ApiResponse<IngredientItem[]>>("/ingredients");
	return response.data.data;
}

export async function addIngredient(item: IngredientItem): Promise<void> {
	const response = await apiClient.post<ApiResponse<void>>(
		"/ingredients/add",
		item,
	);
	return response.data.data;
}

export async function editIngredient(item: IngredientItem): Promise<void> {
	const response = await apiClient.post<ApiResponse<void>>(
		"/ingredients/edit",
		item,
	);
	return response.data.data;
}

export async function removeIngredient(
	item: Pick<IngredientItem, "name">,
): Promise<void> {
	const response = await apiClient.post<ApiResponse<void>>(
		"/ingredients/remove",
		item,
	);
	return response.data.data;
}
