import { createZodDto } from "nestjs-zod";

import {
	RecipeBodySchema,
	RecipeItemSchema,
	RecipeSchema,
	UpdateRecipeSchema,
} from "../types/recipes.types";

export class RecipeDto extends createZodDto(RecipeSchema) {}
export class RecipeItemDto extends createZodDto(RecipeItemSchema) {}
export class CreateRecipeDto extends createZodDto(RecipeBodySchema) {}
export class UpdateRecipeDto extends createZodDto(UpdateRecipeSchema) {}
