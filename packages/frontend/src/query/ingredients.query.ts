import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
	addIngredient,
	addIngredientByAi,
	editIngredient,
	getIngredients,
	removeIngredient,
} from "./ingredients.api";
import type { IngredientItem, IngredientNameInput } from "./ingredients.types";

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

export const useAddIngredientByAi = () => {
	const queryClient = useQueryClient();
	const mutation = useMutation<IngredientItem, Error, IngredientNameInput>({
		mutationFn: addIngredientByAi,
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
	const mutation = useMutation<void, Error, IngredientNameInput>({
		mutationFn: removeIngredient,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["ingredients"] });
		},
	});

	return mutation;
};
