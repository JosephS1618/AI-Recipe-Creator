export type AuthUser = {
	accountId: string;
	email: string;
	username: string;
	accountType: "trial" | "paid" | "none";
};

export type LoginInput = {
	email: string;
	password: string;
};

export type RegisterInput = {
	email: string;
	username: string;
	password: string;
};
