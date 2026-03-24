import { Injectable } from "@nestjs/common";

import type { CommunityPostItem } from "./community-post.types";
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
}
