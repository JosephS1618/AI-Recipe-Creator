import { Body, Controller, Get, Post } from "@nestjs/common";

import { CurrentAccountId } from "./decorators/current-account-id";
import {
	CreateRecipeNoteDto,
	RecipeNotesService,
} from "./recipe-notes.service";

@Controller()
export class RecipeNotesController {
	constructor(private readonly recipeNotesService: RecipeNotesService) {}

	@Get("recipe-notes")
	list(@CurrentAccountId() accountId: string) {
		return this.recipeNotesService.list(accountId);
	}

	@Post("recipe-notes/create")
	create(
		@CurrentAccountId() accountId: string,
		@Body() body: CreateRecipeNoteDto,
	) {
		return this.recipeNotesService.create({
			...body,
			account_id: accountId,
		});
	}
}
