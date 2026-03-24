import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
} from "@nestjs/common";

import { CurrentAccountId } from "./decorators/current-account-id";
import {
	CoOwner,
	CreateInventoryDto,
	DeleteInventoryDto,
	InventoriesService,
	Inventory,
	ShareInventoryDto,
	UnshareInventoryDto,
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

	@Get("/inventory/:inventoryId/shared-users")
	async getCoOwners(
		@CurrentAccountId() accountId: string,
		@Param("inventoryId") inventoryId: string,
	): Promise<CoOwner[]> {
		return this.service.getCoOwners(inventoryId, accountId);
	}

	@Post("/inventory/:inventoryId/share")
	async share(
		@CurrentAccountId() accountId: string,
		@Param("inventoryId") inventoryId: string,
		@Body() data: ShareInventoryDto,
	): Promise<void> {
		return this.service.shareInventory(inventoryId, accountId, data);
	}

	@Delete("/inventory/:inventoryId/unshare")
	async unshare(
		@CurrentAccountId() accountId: string,
		@Param("inventoryId") inventoryId: string,
		@Body() data: UnshareInventoryDto,
	): Promise<void> {
		return this.service.unshareInventory(inventoryId, accountId, data);
	}
}
