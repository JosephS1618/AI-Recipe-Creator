export type Inventory = {
	inventoryid: string;
	name: string;
	description: string;
	type: string;
	ownerAccountId: string;
	ownerUsername: string;
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

export type ShareInventoryInput = {
	emailOrUsername: string;
};

export type UnshareInventoryInput = {
	accountId: string;
};

export type CoOwner = {
	accountid: string;
	email: string;
	username: string;
};
