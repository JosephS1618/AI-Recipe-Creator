import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
	createInventory,
	deleteInventory,
	listInventories,
	updateInventory,
} from "./inventories.api";
import type {
	CreateInventoryInput,
	DeleteInventoryInput,
	Inventory,
	UpdateInventoryInput,
} from "./inventories.types";

export const useFetchInventories = () => {
	return useQuery({ queryKey: ["inventories"], queryFn: listInventories });
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
