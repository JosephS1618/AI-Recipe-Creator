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

export type CreateRecipeNoteInput = {
	note: string;
	photo?: string | null;
	recipe_ids: string[];
};
