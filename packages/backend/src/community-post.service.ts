import { randomUUID } from "node:crypto";
import { Injectable } from "@nestjs/common";

import type {
	CommunityPostItem,
	CreateCommunityPost,
} from "./community-post.types";
import { sql } from "./sql";

@Injectable()
export class CommunityPostService {
	async list(accountId: string): Promise<CommunityPostItem[]> {
		return sql<CommunityPostItem[]>`
			SELECT
				p.PostID AS post_id,
				p.Title AS title,
				p.Body AS body,
				p.CreationDate AS creation_date,
				p.Visibility AS visibility,
				p.AccountID AS account_id,
				p.RecipeID AS recipe_id,
				r.Name AS recipe_name,
				pr.Emoji AS user_reaction
			FROM Post p
			LEFT JOIN Recipe r ON p.RecipeID = r.RecipeID
			LEFT JOIN PostReaction pr ON p.PostID = pr.PostID AND pr.AccountID = ${accountId}
			WHERE p.Visibility = 'public' OR p.AccountID = ${accountId}
			ORDER BY p.CreationDate DESC;
		`;
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

	async searchByRecipeName(
		recipeName: string,
		accountId: string,
	): Promise<CommunityPostItem[]> {
		const searchParam = `%${recipeName}%`;

		return sql<CommunityPostItem[]>`
			SELECT
				p.PostID AS post_id,
				p.Title AS title,
				p.Body AS body,
				p.CreationDate AS creation_date,
				p.Visibility AS visibility,
				p.AccountID AS account_id,
				p.RecipeID AS recipe_id,
				r.Name AS recipe_name,
				pr.Emoji AS user_reaction
			FROM Post p
			JOIN Recipe r ON p.RecipeID = r.RecipeID
			LEFT JOIN PostReaction pr ON p.PostID = pr.PostID AND pr.AccountID = ${accountId}
			WHERE (p.Visibility = 'public' OR p.AccountID = ${accountId}) AND r.Name ILIKE ${searchParam}
			ORDER BY p.CreationDate DESC;
		`;
	}
}
