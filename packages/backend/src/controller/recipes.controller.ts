import { Body, Controller, Get, Param, Post } from "@nestjs/common";

import { CurrentAccountId } from "../decorators/current-account-id";
import { CreateRecipeDto, UpdateRecipeDto } from "../dto/recipes.dto";
import { RecipesService } from "../service/recipes.service";

@Controller()
export class RecipesController {
	constructor(private readonly recipesService: RecipesService) {}

	@Get("recipes")
	list() {
		return this.recipesService.list();
	}

	@Post("recipe/create")
	create(@CurrentAccountId() accountId: string, @Body() body: CreateRecipeDto) {
		return this.recipesService.create({
			...body,
			account_id: accountId,
		});
	}

	@Get("recipe/:recipeId")
	get(@Param("recipeId") recipeId: string) {
		return this.recipesService.get(recipeId);
	}

	@Post("recipe/:recipeId/delete")
	remove(
		@CurrentAccountId() accountId: string,
		@Param("recipeId") recipeId: string,
	) {
		return this.recipesService.remove(recipeId, accountId);
	}

	@Post("recipe/:recipeId/update")
	update(
		@CurrentAccountId() accountId: string,
		@Param("recipeId") recipeId: string,
		@Body() body: UpdateRecipeDto,
	) {
		return this.recipesService.update({
			...body,
			recipe_id: recipeId,
			account_id: accountId,
		});
	}
}
