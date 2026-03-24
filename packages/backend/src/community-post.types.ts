import { z } from "zod";

export const CommunityPostItemSchema = z.object({
	post_id: z.string().uuid(),
	title: z.string(),
	body: z.string(),
	creation_date: z.string(),
	visibility: z.enum(["private", "public"]),
	account_id: z.string().uuid(),
	recipe_id: z.string().uuid().nullable(),
});

export type CommunityPostItem = z.infer<typeof CommunityPostItemSchema>;
