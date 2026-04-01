import { createZodDto } from "nestjs-zod";

import {
	ListRecipesQuerySchema,
	RecipeBodySchema,
	RecipeIngredientCountSchema,
	RecipeItemSchema,
	RecipeSchema,
} from "./recipes.types";

export class RecipeDto extends createZodDto(RecipeSchema) {}
export class RecipeItemDto extends createZodDto(RecipeItemSchema) {}
export class RecipeIngredientCountDto extends createZodDto(
	RecipeIngredientCountSchema,
) {}
export class CreateRecipeDto extends createZodDto(RecipeBodySchema) {}
export class UpdateRecipeDto extends createZodDto(RecipeBodySchema) {}
export class ListRecipesQueryDto extends createZodDto(ListRecipesQuerySchema) {}
