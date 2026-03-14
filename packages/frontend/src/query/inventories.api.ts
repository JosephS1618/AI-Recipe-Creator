import type {
	CreateInventoryInput,
	DeleteInventoryInput,
	Inventory,
	UpdateInventoryInput,
} from "./inventories.types";
import { type ApiResponse, apiClient } from "./request.utils";

export async function listInventories(): Promise<Inventory[]> {
	const response =
		await apiClient.get<ApiResponse<Inventory[]>>("/inventories");
	return response.data.data;
}

export async function createInventory(
	data: CreateInventoryInput,
): Promise<Inventory> {
	const response = await apiClient.post<ApiResponse<Inventory>>(
		"/inventories/create",
		data,
	);
	return response.data.data;
}

export async function updateInventory(
	data: UpdateInventoryInput,
): Promise<Inventory> {
	const response = await apiClient.put<ApiResponse<Inventory>>(
		"/inventories/update",
		data,
	);
	return response.data.data;
}

export async function deleteInventory(
	data: DeleteInventoryInput,
): Promise<void> {
	const response = await apiClient.delete<ApiResponse<void>>(
		"/inventories/delete",
		{ data },
	);
	return response.data.data;
}
