import { z } from "zod";

export const CommunityPostItemSchema = z.object({
	post_id: z.string().uuid(),
	title: z.string(),
	body: z.string(),
	creation_date: z.string(),
	visibility: z.enum(["private", "public"]),
	account_id: z.string().uuid(),
	recipe_id: z.string().uuid().nullable(),
	user_reaction: z.string().nullable().optional(),
});

export const CommunityPostBodySchema = z.object({
	title: z.string(),
	body: z.string(),
	visibility: z.enum(["private", "public"]),
	recipe_id: z.string().uuid().nullable(),
});

export const PostSearchResultSchema = z.object({
	title: z.string(),
	body: z.string(),
	creation_date: z.string(),
	username: z.string(),
	recipe_name: z.string(),
});

export type CommunityPostItem = z.infer<typeof CommunityPostItemSchema>;
export type CommunityPostBody = z.infer<typeof CommunityPostBodySchema>;
export type PostSearchResult = z.infer<typeof PostSearchResultSchema>;

export type CreateCommunityPost = CommunityPostBody & {
	account_id: string;
};
