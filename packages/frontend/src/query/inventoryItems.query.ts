import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
	addInventoryItem,
	addInventoryItemsFromReceipt,
	deleteInventoryItem,
	getInventoryItems,
	updateInventoryItem,
} from "./inventoryItems.api";

import type {
	CreateInventoryItem,
	CreateInventoryItemsFromReceiptInput,
	CreateInventoryItemsFromReceiptResult,
	DeleteInventoryItem,
	InventoryItem,
	InventoryItemFilter,
} from "./inventoryItems.types";

export function useGetInventoryItems(
	inventoryId: string,
	filters: InventoryItemFilter[] = [],
) {
	return useQuery({
		queryKey: ["inventoryItems", inventoryId, filters],
		queryFn: () => getInventoryItems(inventoryId, filters),
	});
}

export const useAddInventoryItem = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation<
		void,
		Error,
		{ inventoryId: string; item: CreateInventoryItem }
	>({
		mutationFn: ({ inventoryId, item }) => addInventoryItem(inventoryId, item),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["inventoryItems", variables.inventoryId],
			});
		},
	});

	return mutation;
};

export const useAddInventoryItemsFromReceipt = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation<
		CreateInventoryItemsFromReceiptResult,
		Error,
		{ inventoryId: string; input: CreateInventoryItemsFromReceiptInput }
	>({
		mutationFn: ({ inventoryId, input }) =>
			addInventoryItemsFromReceipt(inventoryId, input),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["inventoryItems", variables.inventoryId],
			});
			queryClient.invalidateQueries({
				queryKey: ["ingredients"],
			});
		},
	});

	return mutation;
};

export const useEditInventoryItem = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation<
		void,
		Error,
		{ inventoryId: string; item: InventoryItem }
	>({
		mutationFn: ({ inventoryId, item }) =>
			updateInventoryItem(inventoryId, item),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["inventoryItems", variables.inventoryId],
				refetchType: "all",
			});
		},
	});

	return mutation;
};

export const useRemoveInventoryItem = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation<
		void,
		Error,
		{ inventoryId: string; item: DeleteInventoryItem }
	>({
		mutationFn: ({ inventoryId, item }) =>
			deleteInventoryItem(inventoryId, item),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["inventoryItems", variables.inventoryId],
			});
		},
	});

	return mutation;
};
