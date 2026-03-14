import { Injectable } from "@nestjs/common";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { sql } from "./sql";

export const InventoryItemBodySchema = z.object({
	quantity: z.number().int(),
	creation_date: z.string(),
	expiration_date: z.string().nullable(),
	ingredient_name: z.string(),
	receipt_id: z.string().uuid().nullable(),
});

export const InventoryItemSchema = InventoryItemBodySchema.extend({
	inventory_item_id: z.number().int(),
	inventory_id: z.string().uuid(),
});

export const EditInventoryItemSchema = InventoryItemBodySchema.extend({
	inventory_item_id: z.number().int(),
});

export const DeleteInventoryItemSchema = z.object({
	inventory_id: z.string().uuid(),
	inventory_item_id: z.number().int(),
});

export type InventoryItemBody = z.infer<typeof InventoryItemBodySchema>;
export type InventoryItem = z.infer<typeof InventoryItemSchema>;
export type EditInventoryItemBody = z.infer<typeof EditInventoryItemSchema>;
export type DeleteInventoryItem = z.infer<typeof DeleteInventoryItemSchema>;

export type CreateInventoryItem = InventoryItemBody & {
	inventory_id: string;
};

export type EditInventoryItem = EditInventoryItemBody & {
	inventory_id: string;
};

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

@Injectable()
export class InventoryItemsService {
	async list(inventory_id: string): Promise<InventoryItem[]> {
		return sql<InventoryItem[]>`
			SELECT
				InventoryItemID AS inventory_item_id,
				InventoryID AS inventory_id,
				Quantity AS quantity,
				CreationDate AS creation_date,
				ExpirationDate AS expiration_date,
				IngredientName AS ingredient_name,
				ReceiptID AS receipt_id
			FROM InventoryItem
			WHERE InventoryID = ${inventory_id}
			ORDER BY InventoryItemID ASC;
		`;
	}

	async add(item: CreateInventoryItem): Promise<void> {
		const nextInventoryItemIDRows = await sql<{ next_id: number }[]>`
			SELECT COALESCE(MAX(InventoryItemID), 0) + 1 AS next_id
			FROM InventoryItem
			WHERE InventoryID = ${item.inventory_id};
		`;

		const inventory_item_id = nextInventoryItemIDRows[0].next_id;

		await sql`
			INSERT INTO InventoryItem (InventoryItemID, InventoryID, Quantity, CreationDate, ExpirationDate, IngredientName, ReceiptID)
			VALUES (${inventory_item_id}, ${item.inventory_id}, ${item.quantity}, ${item.creation_date}, ${item.expiration_date}, ${item.ingredient_name}, ${item.receipt_id})
		`;
	}

	async remove(item: DeleteInventoryItem): Promise<void> {
		await sql`
			DELETE FROM InventoryItem
			WHERE InventoryItemID = ${item.inventory_item_id} AND InventoryID = ${item.inventory_id};
		`;
	}

	async edit(item: EditInventoryItem): Promise<void> {
		await sql`
			UPDATE InventoryItem
			SET
				Quantity = ${item.quantity},
				CreationDate = ${item.creation_date},
				ExpirationDate = ${item.expiration_date},
				IngredientName = ${item.ingredient_name},
				ReceiptID = ${item.receipt_id}
			WHERE InventoryItemID = ${item.inventory_item_id} AND InventoryID = ${item.inventory_id};
		`;
	}
}
