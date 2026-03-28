import type {
	CreateRecipeNoteInput,
	ListRecipeNotesInput,
	RecipeNote,
	RecipeNoteTableData,
	UpdateRecipeNoteInput,
} from "./recipe-notes.types";
import { type ApiResponse, apiClient } from "./request.utils";

export async function listRecipeNotes(
	data: ListRecipeNotesInput,
): Promise<RecipeNoteTableData> {
	const response = await apiClient.post<ApiResponse<RecipeNoteTableData>>(
		"/recipe-notes",
		data,
	);
	return response.data.data;
}

export async function createRecipeNote(
	data: CreateRecipeNoteInput,
): Promise<RecipeNote> {
	const response = await apiClient.post<ApiResponse<RecipeNote>>(
		"/recipe-notes/create",
		data,
	);
	return response.data.data;
}

export async function getRecipeNote(recipeNoteId: string): Promise<RecipeNote> {
	const response = await apiClient.get<ApiResponse<RecipeNote>>(
		`/recipe-note/${recipeNoteId}`,
	);
	return response.data.data;
}

export async function updateRecipeNote(
	data: UpdateRecipeNoteInput,
): Promise<RecipeNote> {
	const response = await apiClient.post<ApiResponse<RecipeNote>>(
		`/recipe-note/${data.recipe_note_id}/update`,
		{
			note: data.note,
			photo: data.photo,
			recipe_ids: data.recipe_ids,
		},
	);
	return response.data.data;
}

export async function deleteRecipeNote(recipeNoteId: string): Promise<void> {
	const response = await apiClient.post<ApiResponse<void>>(
		`/recipe-note/${recipeNoteId}/delete`,
	);
	return response.data.data;
}
