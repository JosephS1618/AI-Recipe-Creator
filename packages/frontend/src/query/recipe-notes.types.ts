export type RecipeNoteRecipe = {
	recipe_id: string;
	name: string;
};

export type RecipeNoteListItem = {
	recipe_note_id: string;
	photo: string | null;
	note: string;
	account_id: string;
	creation_date: string;
	modification_date: string;
};

export type RecipeNote = RecipeNoteListItem & {
	recipes: RecipeNoteRecipe[];
};

export type RecipeNoteColumn =
	| "recipe_note_id"
	| "photo"
	| "note"
	| "account_id"
	| "creation_date"
	| "modification_date";

export type RecipeNoteTableCell = string | null;

export type RecipeNoteTableData = {
	columns: RecipeNoteColumn[];
	rows: RecipeNoteTableCell[][];
};

export type ListRecipeNotesInput = {
	columns: RecipeNoteColumn[];
};

export type CreateRecipeNoteInput = {
	note: string;
	photo?: string | null;
	recipe_ids: string[];
};

export type UpdateRecipeNoteInput = CreateRecipeNoteInput & {
	recipe_note_id: string;
};
