import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
	addInventoryItem,
	deleteInventoryItem,
	getInventoryItems,
	updateInventoryItem,
} from "./inventoryItems.api";

import type {
	CreateInventoryItem,
	DeleteInventoryItem,
	InventoryItem,
} from "./inventoryItems.types";

export function useGetInventoryItems(inventoryId: string) {
	return useQuery({
		queryKey: ["inventoryItems", inventoryId],
		queryFn: () => getInventoryItems(inventoryId),
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
