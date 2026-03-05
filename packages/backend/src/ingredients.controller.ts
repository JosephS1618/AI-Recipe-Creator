import { Body, Controller, Get, Post } from "@nestjs/common";

import {
	IngredientItem,
	IngredientItemDto,
	IngredientNameDto,
	IngredientService,
} from "./ingredients.service";

@Controller("ingredients")
export class IngredientController {
	constructor(private readonly service: IngredientService) {}

	@Get("")
	async list(): Promise<IngredientItem[]> {
		return this.service.list();
	}

	@Post("/add")
	async add(@Body() item: IngredientItemDto): Promise<void> {
		await this.service.add(item);
	}

	@Post("/remove")
	async remove(@Body() item: IngredientNameDto): Promise<void> {
		await this.service.remove(item);
	}

	@Post("/edit")
	async edit(@Body() item: IngredientItemDto): Promise<void> {
		await this.service.edit(item);
	}
}
