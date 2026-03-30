export type RecipeIngredient = {
	ingredient_name: string;
	quantity: number;
};

export type RecipeDivisionIngredient = {
	ingredient_name: string;
};

export type Recipe = {
	recipe_id: string;
	account_id: string;
	name: string;
	content: string;
	cuisine: string | null;
	time: number;
	cost_in_cents: number;
	creation_date: string;
	modification_date: string;
	ingredients: RecipeIngredient[];
};

export type RecipeItem = {
	recipe_id: string;
	name: string;
	content: string;
	cuisine: string | null;
	time: number;
	cost_in_cents: number;
	creation_date: string;
	modification_date: string;
	total_protein?: number;
};

export type CreateRecipeInput = {
	name: string;
	content: string;
	cuisine: string | null;
	cost_in_cents: number;
	time: number;
	ingredients: RecipeIngredient[];
};

export type UpdateRecipeInput = {
	recipe_id: string;
	name: string;
	content: string;
	cuisine: string | null;
	cost_in_cents: number;
	time: number;
	ingredients: RecipeIngredient[];
};

export type ListRecipesQuery = {
	minTotalProtein?: number;
};
