import { createZodDto } from "nestjs-zod";

import {
	DeleteInventoryItemSchema,
	EditInventoryItemSchema,
	InventoryItemBodySchema,
	InventoryItemSchema,
} from "./inventoryItems.types";

export class InventoryItemDto extends createZodDto(InventoryItemSchema) {}

export class CreateInventoryItemDto extends createZodDto(
	InventoryItemBodySchema,
) {}
export class EditInventoryItemDto extends createZodDto(
	EditInventoryItemSchema,
) {}
export class DeleteInventoryItemDto extends createZodDto(
	DeleteInventoryItemSchema,
) {}
