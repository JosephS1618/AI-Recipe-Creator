import { Body, Controller, Get, Param, Post } from "@nestjs/common";

import { CurrentAccountId } from "./decorators/current-account-id";
import {
	CreateInventoryItemDto,
	DeleteInventoryItemDto,
	EditInventoryItemDto,
} from "./inventoryItems.dto";
import { InventoryItemsService } from "./inventoryItems.service";
import {
	CreateReceiptDto,
	type CreateReceiptResult,
	ReceiptService,
} from "./receipt.service";

@Controller("inventory/:inventoryId/items")
export class InventoryItemsController {
	constructor(
		private readonly receiptService: ReceiptService,
		private readonly inventoryItemsService: InventoryItemsService,
	) {}

	@Get()
	async list(@Param("inventoryId") inventoryId: string) {
		return this.inventoryItemsService.list(inventoryId);
	}

	@Post("create")
	async add(
		@Param("inventoryId") inventoryId: string,
		@Body() item: CreateInventoryItemDto,
	) {
		await this.inventoryItemsService.add({
			...item,
			inventory_id: inventoryId,
		});
	}

	@Post("create-from-receipt")
	async addFromReceipt(
		@CurrentAccountId() accountId: string,
		@Param("inventoryId") inventoryId: string,
		@Body() input: CreateReceiptDto,
	): Promise<CreateReceiptResult> {
		return this.receiptService.addFromReceipt(
			accountId,
			inventoryId,
			input.fileName,
		);
	}

	@Post("delete")
	async remove(
		@Param("inventoryId") inventoryId: string,
		@Body() item: DeleteInventoryItemDto,
	) {
		await this.inventoryItemsService.remove({
			...item,
			inventory_id: inventoryId,
		});
	}

	@Post("update")
	async edit(
		@Param("inventoryId") inventoryId: string,
		@Body() item: EditInventoryItemDto,
	) {
		await this.inventoryItemsService.edit({
			...item,
			inventory_id: inventoryId,
		});
	}
}
