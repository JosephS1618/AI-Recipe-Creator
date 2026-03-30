export type InventoryItem = {
	inventory_item_id: number;
	inventory_id: string;
	quantity: number;
	creation_date: string;
	expiration_date: string | null;
	ingredient_name: string;
	receipt_id: string | null;
};

export type InventoryItemFilterAttribute =
	| "ingredient_name"
	| "quantity"
	| "creation_date"
	| "expiration_date"
	| "receipt_id";

export type InventoryItemFilter = {
	attribute: InventoryItemFilterAttribute;
	value: string;
	isOR?: boolean;
};

export type CreateInventoryItem = {
	quantity: number;
	creation_date: string;
	expiration_date: string | null;
	ingredient_name: string;
	receipt_id: string | null;
};

export type DeleteInventoryItem = {
	inventory_item_id: number;
	inventory_id: string;
};

export type CreateInventoryItemsFromReceiptInput = {
	fileName: string;
};

export type CreateInventoryItemsFromReceiptResult = {
	receiptId: string;
	createdItems: InventoryItem[];
	createdIngredientNames: string[];
};
