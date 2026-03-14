import { z } from "zod";

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

export const EditInventoryItemSchema = InventoryItemSchema.omit({
	inventory_id: true,
});

export const DeleteInventoryItemSchema = z.object({
	inventory_id: z.string().uuid(),
	inventory_item_id: z.number().int(),
});

export type InventoryItem = z.infer<typeof InventoryItemSchema>;
export type InventoryItemBody = z.infer<typeof InventoryItemBodySchema>;
export type EditInventoryItemBody = z.infer<typeof EditInventoryItemSchema>;
export type DeleteInventoryItem = z.infer<typeof DeleteInventoryItemSchema>;

export type CreateInventoryItem = InventoryItemBody & {
	inventory_id: string;
};

export type EditInventoryItem = EditInventoryItemBody & {
	inventory_id: string;
};
