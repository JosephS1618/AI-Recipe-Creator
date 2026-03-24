import { randomUUID } from "node:crypto";
import { Injectable } from "@nestjs/common";

import type {
	CommunityPostItem,
	CreateCommunityPost,
} from "./community-post.types";
import { sql } from "./sql";

@Injectable()
export class CommunityPostService {
	async list(): Promise<CommunityPostItem[]> {
		const posts = await sql<CommunityPostItem[]>`
			SELECT
				PostID AS post_id,
				Title AS title,
				Body AS body,
				CreationDate AS creation_date,
				Visibility AS visibility,
				AccountID AS account_id,
				RecipeID AS recipe_id
			FROM Post 
			ORDER BY CreationDate DESC;
		`;
		return posts;
	}

	async create(post: CreateCommunityPost): Promise<void> {
		const post_id = randomUUID();
		const now = new Date().toISOString();

		await sql`
			INSERT INTO Post (
				PostID,
				Title,
				Body,
				CreationDate,
				Visibility,
				AccountID,
				RecipeID
			)
			VALUES (
				${post_id},
				${post.title},
				${post.body},
				${now},
				${post.visibility},
				${post.account_id},
				${post.recipe_id}
			);
		`;
	}
}
