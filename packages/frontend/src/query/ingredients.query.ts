import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
	addIngredient,
	editIngredient,
	getIngredients,
	removeIngredient,
} from "./ingredients.api";
import type { IngredientItem } from "./ingredients.types";

export const useFetchIngredients = () => {
	return useQuery({ queryKey: ["ingredients"], queryFn: getIngredients });
};

export const useAddIngredient = () => {
	const queryClient = useQueryClient();
	const mutation = useMutation<void, Error, IngredientItem>({
		mutationFn: addIngredient,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["ingredients"] });
		},
	});

	return mutation;
};

export const useEditIngredient = () => {
	const queryClient = useQueryClient();
	const mutation = useMutation<void, Error, IngredientItem>({
		mutationFn: editIngredient,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["ingredients"] });
		},
	});

	return mutation;
};

export const useRemoveIngredient = () => {
	const queryClient = useQueryClient();
	const mutation = useMutation<void, Error, Pick<IngredientItem, "name">>({
		mutationFn: removeIngredient,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["ingredients"] });
		},
	});

	return mutation;
};
