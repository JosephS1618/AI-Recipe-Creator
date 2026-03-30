import { Injectable, InternalServerErrorException } from "@nestjs/common";
import {
	type CreateInventoryItem,
	type DeleteInventoryItem,
	type EditInventoryItem,
	type InventoryItem,
	type InventoryItemFilter,
	type SelectInventoryItemsBody,
} from "./inventoryItems.types";
import { sql } from "./sql";

@Injectable()
export class InventoryItemsService {
	async list(
		inventory_id: string,
		body: SelectInventoryItemsBody = { filters: [] },
	): Promise<InventoryItem[]> {
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
			${this.buildConditions(body.filters)}
			ORDER BY InventoryItemID;
		`;
	}

	private buildConditions(filters: InventoryItemFilter[]) {
		if (filters.length === 0) {
			return sql``;
		}

		let clause = this.buildCondition(filters[0]);

		for (const filter of filters.slice(1)) {
			clause = sql`${clause}${filter.isOR ? sql` OR ` : sql` AND `}${this.buildCondition(filter)}`;
		}

		return sql` AND (${clause})`;
	}

	private buildCondition(filter: InventoryItemFilter) {
		switch (filter.attribute) {
			case "ingredient_name":
				return sql`IngredientName = ${filter.value}`;
			case "quantity":
				return sql`Quantity = ${filter.value}`;
			case "creation_date":
				return sql`DATE(CreationDate) = ${filter.value}`;
			case "expiration_date":
				return sql`DATE(ExpirationDate) = ${filter.value}`;
			case "receipt_id":
				return sql`ReceiptID = ${filter.value}`;
		}
	}

	async add(item: CreateInventoryItem): Promise<InventoryItem> {
		const [{ max_item_id }] = await sql<{ max_item_id: number }[]>`
			SELECT COALESCE(MAX(InventoryItemID), 0) AS max_item_id
			FROM InventoryItem
			WHERE InventoryID = ${item.inventory_id};
		`;

		const new_inventory_item_id = max_item_id + 1;

		const [createdItem] = await sql<InventoryItem[]>`
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
			RETURNING
				InventoryItemID AS inventory_item_id,
				InventoryID AS inventory_id,
				Quantity AS quantity,
				CreationDate AS creation_date,
				ExpirationDate AS expiration_date,
				IngredientName AS ingredient_name,
				ReceiptID AS receipt_id;
		`;

		if (!createdItem) {
			throw new InternalServerErrorException("Failed to create inventory item");
		}

		return createdItem;
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
