import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	createRecipe,
	deleteRecipe,
	generateAiRecipe,
	getRecipe,
	listRecipes,
	updateRecipe,
} from "./recipes.api";
import type {
	CreateRecipeInput,
	Recipe,
	UpdateRecipeInput,
} from "./recipes.types";

export function useGetRecipes() {
	return useQuery({
		queryKey: ["recipes"],
		queryFn: listRecipes,
	});
}

export function useGetRecipe(recipeId: string) {
	return useQuery({
		queryKey: ["recipe", recipeId],
		queryFn: () => getRecipe(recipeId),
		enabled: Boolean(recipeId),
	});
}

export function useCreateRecipe() {
	const queryClient = useQueryClient();

	return useMutation<Recipe, Error, CreateRecipeInput>({
		mutationFn: createRecipe,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["recipes"] });
		},
	});
}

export function useGenerateAiRecipe() {
	const queryClient = useQueryClient();

	return useMutation<Recipe, Error, void>({
		mutationFn: generateAiRecipe,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["recipes"] });
		},
	});
}

export function useUpdateRecipe() {
	const queryClient = useQueryClient();

	return useMutation<Recipe, Error, UpdateRecipeInput>({
		mutationFn: updateRecipe,
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ["recipes"] });
			queryClient.invalidateQueries({
				queryKey: ["recipe", variables.recipe_id],
			});
		},
	});
}

export function useDeleteRecipe() {
	const queryClient = useQueryClient();

	return useMutation<void, Error, string>({
		mutationFn: deleteRecipe,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["recipes"] });
		},
	});
}
