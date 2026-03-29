export type CommunityPostItem = {
	post_id: string;
	title: string;
	body: string;
	creation_date: string;
	visibility: "private" | "public";
	account_id: string;
	recipe_id: string | null;
	user_reaction?: string | null;
};

export type CommunityPostBody = {
	title: string;
	body: string;
	visibility: "private" | "public";
	recipe_id: string | null;
};
