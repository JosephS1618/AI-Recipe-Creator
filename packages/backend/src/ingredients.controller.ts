import { Body, Controller, Get, Post } from "@nestjs/common";

import {
	FrequentlyUsedIngredient,
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

	@Get("/frequently-used")
	async frequentlyUsedIngredients(): Promise<FrequentlyUsedIngredient[]> {
		return this.service.frequentlyUsedIngredients();
	}

	@Post("/add")
	async add(@Body() item: IngredientItemDto): Promise<void> {
		await this.service.add(item);
	}

	@Post("/add-by-ai")
	async addByAi(@Body() item: IngredientNameDto): Promise<IngredientItem> {
		return this.service.addByAi(item);
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
