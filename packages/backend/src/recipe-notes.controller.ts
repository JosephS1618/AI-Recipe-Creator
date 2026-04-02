import { Body, Controller, Get, Param, Post } from "@nestjs/common";

import { CurrentAccountId } from "./decorators/current-account-id";
import {
	CreateRecipeNoteDto,
	ProjectRecipeNotesDto,
	RecipeNotesService,
	UpdateRecipeNoteDto,
} from "./recipe-notes.service";

@Controller()
export class RecipeNotesController {
	constructor(private readonly recipeNotesService: RecipeNotesService) {}

	@Post("recipe-notes")
	list(
		@CurrentAccountId() accountId: string,
		@Body() body: ProjectRecipeNotesDto,
	) {
		return this.recipeNotesService.list(accountId, body);
	}

	@Get("recipe-note/:recipeNoteId")
	get(
		@CurrentAccountId() accountId: string,
		@Param("recipeNoteId") recipeNoteId: string,
	) {
		return this.recipeNotesService.get(recipeNoteId, accountId);
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

	@Post("recipe-note/:recipeNoteId/update")
	update(
		@CurrentAccountId() accountId: string,
		@Param("recipeNoteId") recipeNoteId: string,
		@Body() body: UpdateRecipeNoteDto,
	) {
		return this.recipeNotesService.update({
			...body,
			recipe_note_id: recipeNoteId,
			account_id: accountId,
		});
	}

	@Post("recipe-note/:recipeNoteId/delete")
	remove(
		@CurrentAccountId() accountId: string,
		@Param("recipeNoteId") recipeNoteId: string,
	) {
		return this.recipeNotesService.remove(recipeNoteId, accountId);
	}
}
