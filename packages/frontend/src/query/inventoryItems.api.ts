import type {
	CreateInventoryItem,
	CreateInventoryItemsFromReceiptInput,
	CreateInventoryItemsFromReceiptResult,
	DeleteInventoryItem,
	InventoryItem,
} from "./inventoryItems.types";

import { type ApiResponse, apiClient } from "./request.utils";

export async function getInventoryItems(
	inventoryId: string,
): Promise<InventoryItem[]> {
	const response = await apiClient.get<ApiResponse<InventoryItem[]>>(
		`/inventory/${inventoryId}/items`,
	);

	return response.data.data;
}

export async function addInventoryItem(
	inventoryId: string,
	item: CreateInventoryItem,
): Promise<void> {
	const response = await apiClient.post<ApiResponse<void>>(
		`/inventory/${inventoryId}/items/create`,
		item,
	);

	return response.data.data;
}

export async function addInventoryItemsFromReceipt(
	inventoryId: string,
	input: CreateInventoryItemsFromReceiptInput,
): Promise<CreateInventoryItemsFromReceiptResult> {
	const response = await apiClient.post<
		ApiResponse<CreateInventoryItemsFromReceiptResult>
	>(`/inventory/${inventoryId}/items/create-from-receipt`, input);

	return response.data.data;
}

export async function updateInventoryItem(
	inventoryId: string,
	item: InventoryItem,
): Promise<void> {
	const response = await apiClient.post<ApiResponse<void>>(
		`/inventory/${inventoryId}/items/update`,
		item,
	);

	return response.data.data;
}

export async function deleteInventoryItem(
	inventoryId: string,
	item: DeleteInventoryItem,
): Promise<void> {
	const response = await apiClient.post<ApiResponse<void>>(
		`/inventory/${inventoryId}/items/delete`,
		item,
	);

	return response.data.data;
}
