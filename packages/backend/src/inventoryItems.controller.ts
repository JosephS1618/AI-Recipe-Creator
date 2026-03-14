import { Body, Controller, Get, Param, Post } from "@nestjs/common";

import {
	CreateInventoryItemDto,
	EditInventoryItemDto,
	InventoryItemsService,
} from "./inventoryItems.service";

@Controller("inventory/:inventoryId/items")
export class InventoryItemsController {
	constructor(private readonly service: InventoryItemsService) {}

	@Get()
	async list(@Param("inventoryId") inventoryId: string) {
		return this.service.list(inventoryId);
	}

	@Post("create")
	async add(
		@Param("inventoryId") inventoryId: string,
		@Body() item: CreateInventoryItemDto,
	) {
		await this.service.add({
			...item,
			inventory_id: inventoryId,
		});
	}

	@Post("delete")
	async remove(
		@Param("inventoryId") inventoryId: string,
		@Body("inventory_item_id") inventory_item_id: number,
	) {
		await this.service.remove({
			inventory_id: inventoryId,
			inventory_item_id,
		});
	}

	@Post("update")
	async edit(
		@Param("inventoryId") inventoryId: string,
		@Body() item: EditInventoryItemDto,
	) {
		await this.service.edit({
			...item,
			inventory_id: inventoryId,
		});
	}
}
