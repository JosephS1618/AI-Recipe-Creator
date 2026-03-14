import { Body, Controller, Delete, Get, Post, Put } from "@nestjs/common";

import { CurrentAccountId } from "./decorators/current-account-id";
import {
	CreateInventoryDto,
	DeleteInventoryDto,
	InventoriesService,
	Inventory,
	UpdateInventoryDto,
} from "./inventories.service";

@Controller("inventories")
export class InventoriesController {
	constructor(private readonly service: InventoriesService) {}

	@Get("")
	async list(@CurrentAccountId() accountId: string): Promise<Inventory[]> {
		return this.service.listInventories(accountId);
	}

	@Post("/create")
	async create(
		@CurrentAccountId() accountId: string,
		@Body() data: CreateInventoryDto,
	): Promise<Inventory> {
		return this.service.createInventory(accountId, data);
	}

	@Put("/update")
	async update(
		@CurrentAccountId() accountId: string,
		@Body() data: UpdateInventoryDto,
	): Promise<Inventory> {
		return this.service.updateInventory(accountId, data);
	}

	@Delete("/delete")
	async delete(
		@CurrentAccountId() accountId: string,
		@Body() data: DeleteInventoryDto,
	): Promise<void> {
		return this.service.deleteInventory(accountId, data.id);
	}
}
