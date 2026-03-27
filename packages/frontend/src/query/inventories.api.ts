import type {
	CoOwner,
	CreateInventoryInput,
	DeleteInventoryInput,
	Inventory,
	ShareInventoryInput,
	UnshareInventoryInput,
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

export async function getCoOwners(inventoryId: string): Promise<CoOwner[]> {
	const response = await apiClient.get<ApiResponse<CoOwner[]>>(
		`/inventories/inventory/${inventoryId}/shared-users`,
	);
	return response.data.data;
}

export async function shareInventory(
	inventoryId: string,
	data: ShareInventoryInput,
): Promise<void> {
	const response = await apiClient.post<ApiResponse<void>>(
		`/inventories/inventory/${inventoryId}/share`,
		data,
	);
	return response.data.data;
}

export async function unshareInventory(
	inventoryId: string,
	data: UnshareInventoryInput,
): Promise<void> {
	const response = await apiClient.delete<ApiResponse<void>>(
		`/inventories/inventory/${inventoryId}/unshare`,
		{ data },
	);
	return response.data.data;
}
