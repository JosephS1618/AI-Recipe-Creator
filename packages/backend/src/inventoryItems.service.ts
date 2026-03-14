import { Injectable } from "@nestjs/common";
import {
	type CreateInventoryItem,
	type DeleteInventoryItem,
	type EditInventoryItem,
	type InventoryItem,
} from "./inventoryItems.types";
import { sql } from "./sql";

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
			ORDER BY InventoryItemID;
		`;
	}

	async add(item: CreateInventoryItem): Promise<void> {
		const [{ max_item_id }] = await sql<{ max_item_id: number }[]>`
			SELECT COALESCE(MAX(InventoryItemID), 0) AS max_item_id
			FROM InventoryItem
			WHERE InventoryID = ${item.inventory_id};
		`;

		const new_inventory_item_id = max_item_id + 1;

		await sql`
			INSERT INTO InventoryItem (
				InventoryItemID,
				InventoryID,
				Quantity,
				CreationDate,
				ExpirationDate,
				IngredientName,
				ReceiptID
			)
			VALUES (
				${new_inventory_item_id},
				${item.inventory_id},
				${item.quantity},
				${item.creation_date},
				${item.expiration_date},
				${item.ingredient_name},
				${item.receipt_id}
			)
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
