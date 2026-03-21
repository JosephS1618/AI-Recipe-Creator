import { z } from "zod";

export const RecipeIngredientSchema = z.object({
	ingredient_name: z.string(),
	quantity: z.number().int(),
});

export const RecipeBodySchema = z.object({
	name: z.string(),
	content: z.string(),
	cuisine: z.string().nullable(),
	time: z.number().int(),
	ingredients: z.array(RecipeIngredientSchema),
});

export const RecipeSchema = RecipeBodySchema.extend({
	recipe_id: z.string().uuid(),
	account_id: z.string().uuid(),
	cost_in_cents: z.number().int(),
	creation_date: z.string(),
	modification_date: z.string(),
});

export const RecipeItemSchema = z.object({
	recipe_id: z.string().uuid(),
	name: z.string(),
	content: z.string(),
	cuisine: z.string().nullable(),
	time: z.number().int(),
	cost_in_cents: z.number().int(),
	creation_date: z.string(),
	modification_date: z.string(),
});

export const UpdateRecipeSchema = RecipeBodySchema.extend({
	recipe_id: z.string().uuid(),
});

export type RecipeIngredient = z.infer<typeof RecipeIngredientSchema>;
export type RecipeBody = z.infer<typeof RecipeBodySchema>;
export type Recipe = z.infer<typeof RecipeSchema>;
export type RecipeItem = z.infer<typeof RecipeItemSchema>;
export type UpdateRecipeBody = z.infer<typeof UpdateRecipeSchema>;

export type CreateRecipe = RecipeBody & {
	account_id: string;
};

export type UpdateRecipe = UpdateRecipeBody & {
	account_id: string;
};
