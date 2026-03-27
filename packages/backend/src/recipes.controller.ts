import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";

import { AiRecipeService } from "./ai-recipe.service";
import { CurrentAccountId } from "./decorators/current-account-id";
import {
	CreateRecipeDto,
	ListRecipesQueryDto,
	UpdateRecipeDto,
} from "./recipes.dto";
import { RecipesService } from "./recipes.service";

@Controller()
export class RecipesController {
	constructor(
		private readonly recipesService: RecipesService,
		private readonly aiRecipeService: AiRecipeService,
	) {}

	@Get("recipes")
	list(@Query() query: ListRecipesQueryDto) {
		if (query.minTotalProtein !== undefined) {
			return this.recipesService.listWithMinTotalProtein(query.minTotalProtein);
		} else {
			return this.recipesService.list();
		}
	}

	@Post("recipe/create")
	create(@CurrentAccountId() accountId: string, @Body() body: CreateRecipeDto) {
		return this.recipesService.create({
			...body,
			account_id: accountId,
		});
	}

	@Post("recipe/generate-ai")
	generateAi(@CurrentAccountId() accountId: string) {
		return this.aiRecipeService.generate(accountId);
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
