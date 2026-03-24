import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createRecipeNote, listRecipeNotes } from "./recipe-notes.api";
import type { CreateRecipeNoteInput, RecipeNote } from "./recipe-notes.types";

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
