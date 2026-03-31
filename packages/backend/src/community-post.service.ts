import { randomUUID } from "node:crypto";
import { Injectable } from "@nestjs/common";

import type {
	CommunityPostItem,
	CreateCommunityPost,
	PostSearchResult,
} from "./community-post.types";
import { sql } from "./sql";

@Injectable()
export class CommunityPostService {
	async list(accountId?: string): Promise<CommunityPostItem[]> {
		if (!accountId) {
			const posts = await sql<CommunityPostItem[]>`
				SELECT
					PostID AS post_id,
					Title AS title,
					Body AS body,
					CreationDate AS creation_date,
					Visibility AS visibility,
					AccountID AS account_id,
					RecipeID AS recipe_id,
					NULL::VARCHAR AS user_reaction
				FROM Post 
				ORDER BY CreationDate DESC;
			`;
			return posts;
		}

		const posts = await sql<CommunityPostItem[]>`
			SELECT
				p.PostID AS post_id,
				p.Title AS title,
				p.Body AS body,
				p.CreationDate AS creation_date,
				p.Visibility AS visibility,
				p.AccountID AS account_id,
				p.RecipeID AS recipe_id,
				pr.Emoji AS user_reaction
			FROM Post p
			LEFT JOIN PostReaction pr ON p.PostID = pr.PostID AND pr.AccountID = ${accountId}
			ORDER BY p.CreationDate DESC;
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

	async searchByRecipeName(recipeName: string): Promise<PostSearchResult[]> {
		const searchParam = `%${recipeName}%`;
		return sql<PostSearchResult[]>`
			SELECT 
				p.Title AS title,
				p.Body AS body,
				p.CreationDate AS creation_date,
				a.Username AS username,
				r.Name AS recipe_name
			FROM Post p
			JOIN Recipe r ON p.RecipeID = r.RecipeID
			JOIN Account a ON p.AccountID = a.AccountID
			WHERE p.Visibility = 'public' 
			  AND r.Name ILIKE ${searchParam};
		`;
	}
}
