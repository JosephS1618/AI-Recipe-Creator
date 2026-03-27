import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
	createInventory,
	deleteInventory,
	getCoOwners,
	listInventories,
	shareInventory,
	unshareInventory,
	updateInventory,
} from "./inventories.api";
import type {
	CreateInventoryInput,
	DeleteInventoryInput,
	Inventory,
	ShareInventoryInput,
	UnshareInventoryInput,
	UpdateInventoryInput,
} from "./inventories.types";

export const useFetchInventories = () => {
	return useQuery({ queryKey: ["inventories"], queryFn: listInventories });
};

export const useGetCoOwners = (inventoryId: string) => {
	return useQuery({
		queryKey: ["coOwners", inventoryId],
		queryFn: () => getCoOwners(inventoryId),
	});
};

export const useCreateInventory = () => {
	const queryClient = useQueryClient();
	const mutation = useMutation<Inventory, Error, CreateInventoryInput>({
		mutationFn: createInventory,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["inventories"] });
		},
	});

	return mutation;
};

export const useUpdateInventory = () => {
	const queryClient = useQueryClient();
	const mutation = useMutation<Inventory, Error, UpdateInventoryInput>({
		mutationFn: updateInventory,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["inventories"] });
		},
	});

	return mutation;
};

export const useDeleteInventory = () => {
	const queryClient = useQueryClient();
	const mutation = useMutation<void, Error, DeleteInventoryInput>({
		mutationFn: deleteInventory,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["inventories"] });
		},
	});

	return mutation;
};

export const useShareInventory = () => {
	const queryClient = useQueryClient();
	const mutation = useMutation<
		void,
		Error,
		{ inventoryId: string; data: ShareInventoryInput }
	>({
		mutationFn: async ({ inventoryId, data }) =>
			shareInventory(inventoryId, data),
		onSuccess: (_, { inventoryId }) => {
			queryClient.invalidateQueries({ queryKey: ["coOwners", inventoryId] });
			queryClient.invalidateQueries({ queryKey: ["inventories"] });
		},
	});

	return mutation;
};

export const useUnshareInventory = () => {
	const queryClient = useQueryClient();
	const mutation = useMutation<
		void,
		Error,
		{ inventoryId: string; data: UnshareInventoryInput }
	>({
		mutationFn: async ({ inventoryId, data }) =>
			unshareInventory(inventoryId, data),
		onSuccess: (_, { inventoryId }) => {
			queryClient.invalidateQueries({ queryKey: ["coOwners", inventoryId] });
			queryClient.invalidateQueries({ queryKey: ["inventories"] });
		},
	});

	return mutation;
};
