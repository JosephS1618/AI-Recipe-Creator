export type IngredientItem = {
	name: string;
	carbs: number;
	protein: number;
	fat: number;
};

export type IngredientNameInput = Pick<IngredientItem, "name">;
