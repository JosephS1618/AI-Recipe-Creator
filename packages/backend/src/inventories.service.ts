import { Injectable, NotFoundException } from "@nestjs/common";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { sql } from "./sql";

// Zod Schemas
export const CreateInventorySchema = z.object({
	name: z.string().min(1, "Name is required").max(255),
	description: z.string().max(1000).optional().default(""),
	type: z.string().min(1, "Type is required").max(255),
});

export const UpdateInventorySchema = z.object({
	id: z.string().uuid("Invalid inventory ID"),
	name: z.string().min(1, "Name is required").max(255),
	description: z.string().max(1000).optional().default(""),
	type: z.string().min(1, "Type is required").max(255),
});

export const InventoryResponseSchema = z.object({
	inventoryid: z.string().uuid(),
	name: z.string(),
	description: z.string(),
	type: z.string(),
});

export const DeleteInventorySchema = z.object({
	id: z.string().uuid("Invalid inventory ID"),
});

// Types
export type Inventory = z.infer<typeof InventoryResponseSchema>;
export type CreateInventoryInput = z.infer<typeof CreateInventorySchema>;
export type UpdateInventoryInput = z.infer<typeof UpdateInventorySchema>;
export type DeleteInventoryInput = z.infer<typeof DeleteInventorySchema>;

// DTOs
export class CreateInventoryDto extends createZodDto(CreateInventorySchema) {}
export class UpdateInventoryDto extends createZodDto(UpdateInventorySchema) {}
export class DeleteInventoryDto extends createZodDto(DeleteInventorySchema) {}

@Injectable()
export class InventoriesService {
	async listInventories(accountId: string): Promise<Inventory[]> {
		return sql<Inventory[]>`
			SELECT i.*
			FROM Inventory i
			INNER JOIN AccountOwnsInventory aoi ON i.InventoryID = aoi.InventoryID
			WHERE aoi.AccountID = ${accountId}
			ORDER BY i.Name ASC;
		`;
	}

	async createInventory(
		accountId: string,
		data: CreateInventoryInput,
	): Promise<Inventory> {
		const inventoryId = crypto.randomUUID();

		// Insert into Inventory table
		await sql`
			INSERT INTO Inventory (InventoryID, Name, Description, Type)
			VALUES (${inventoryId}, ${data.name}, ${data.description}, ${data.type});
		`;

		// Link account to inventory
		await sql`
			INSERT INTO AccountOwnsInventory (AccountID, InventoryID)
			VALUES (${accountId}, ${inventoryId});
		`;

		// Return the created inventory
		return this.getInventoryById(inventoryId);
	}

	async updateInventory(
		accountId: string,
		data: UpdateInventoryInput,
	): Promise<Inventory> {
		// Verify account owns the inventory
		await this.verifyInventoryOwnership(accountId, data.id);

		// Update inventory
		await sql`
			UPDATE Inventory
			SET Name = ${data.name},
				Description = ${data.description},
				Type = ${data.type}
			WHERE InventoryID = ${data.id};
		`;

		return this.getInventoryById(data.id);
	}

	async deleteInventory(accountId: string, inventoryId: string): Promise<void> {
		// Verify account owns the inventory
		await this.verifyInventoryOwnership(accountId, inventoryId);

		// Delete from AccountOwnsInventory (cascading delete takes care of InventoryItem)
		await sql`
			DELETE FROM Inventory
			WHERE InventoryID = ${inventoryId};
		`;
	}

	async verifyInventoryOwnership(
		accountId: string,
		inventoryId: string,
	): Promise<void> {
		const result = await sql<{ count: string }[]>`
			SELECT COUNT(*) as count
			FROM AccountOwnsInventory
			WHERE AccountID = ${accountId} AND InventoryID = ${inventoryId};
		`;

		if (result.length === 0 || parseInt(result[0].count, 10) === 0) {
			throw new NotFoundException("Inventory not found or access denied");
		}
	}

	private async getInventoryById(inventoryId: string): Promise<Inventory> {
		const result = await sql<Inventory[]>`
			SELECT * FROM Inventory WHERE InventoryID = ${inventoryId};
		`;

		if (result.length === 0) {
			throw new Error("Inventory not found");
		}

		return result[0];
	}
}
