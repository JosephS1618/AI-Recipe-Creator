import type {
	CreateRecipeNoteInput,
	RecipeNote,
	RecipeNoteListItem,
} from "./recipe-notes.types";
import { type ApiResponse, apiClient } from "./request.utils";

export async function listRecipeNotes(): Promise<RecipeNoteListItem[]> {
	const response =
		await apiClient.get<ApiResponse<RecipeNoteListItem[]>>("/recipe-notes");
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
