import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
	createRecipeNote,
	deleteRecipeNote,
	getRecipeNote,
	listRecipeNotes,
	updateRecipeNote,
} from "./recipe-notes.api";
import type {
	CreateRecipeNoteInput,
	RecipeNote,
	UpdateRecipeNoteInput,
} from "./recipe-notes.types";

export function useGetRecipeNotes() {
	return useQuery({
		queryKey: ["recipe-notes"],
		queryFn: listRecipeNotes,
	});
}

export function useCreateRecipeNote() {
	const queryClient = useQueryClient();

	return useMutation<RecipeNote, Error, CreateRecipeNoteInput>({
		mutationFn: createRecipeNote,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["recipe-notes"] });
		},
	});
}

export function useGetRecipeNote(recipeNoteId: string) {
	return useQuery({
		queryKey: ["recipe-note", recipeNoteId],
		queryFn: () => getRecipeNote(recipeNoteId),
		enabled: Boolean(recipeNoteId),
	});
}

export function useUpdateRecipeNote() {
	const queryClient = useQueryClient();

	return useMutation<RecipeNote, Error, UpdateRecipeNoteInput>({
		mutationFn: updateRecipeNote,
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ["recipe-notes"] });
			queryClient.invalidateQueries({
				queryKey: ["recipe-note", variables.recipe_note_id],
			});
		},
	});
}

export function useDeleteRecipeNote() {
	const queryClient = useQueryClient();

	return useMutation<void, Error, string>({
		mutationFn: deleteRecipeNote,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["recipe-notes"] });
		},
	});
}
