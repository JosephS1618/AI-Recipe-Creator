export type Inventory = {
	inventoryid: string;
	name: string;
	description: string;
	type: string;
};

export type CreateInventoryInput = {
	name: string;
	description: string;
	type: string;
};

export type UpdateInventoryInput = {
	id: string;
	name: string;
	description: string;
	type: string;
};

export type DeleteInventoryInput = {
	id: string;
};
