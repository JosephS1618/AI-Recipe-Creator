import { Injectable } from "@nestjs/common";
import { sql } from "./sql";

export interface EmojiData {
	emoji: string;
	kind: string;
}

@Injectable()
export class PostReactionService {
	async getAvailableEmojis(): Promise<EmojiData[]> {
		const emojis = await sql<EmojiData[]>`
			SELECT
				Emoji AS emoji,
				Kind AS kind
			FROM EmojiMeaning
			ORDER BY Kind ASC, Emoji ASC;
		`;
		return emojis;
	}

	async addReaction(
		postId: string,
		accountId: string,
		emoji: string,
	): Promise<void> {
		await sql`
			INSERT INTO PostReaction (PostID, AccountID, Emoji)
			VALUES (${postId}, ${accountId}, ${emoji})
			ON CONFLICT (PostID, AccountID) DO UPDATE SET Emoji = ${emoji};
		`;
	}

	async removeReaction(postId: string, accountId: string): Promise<void> {
		await sql`
			DELETE FROM PostReaction
			WHERE PostID = ${postId} AND AccountID = ${accountId};
		`;
	}

	async getUserReactionForPost(
		postId: string,
		accountId: string,
	): Promise<string | null> {
		const result = await sql<{ emoji: string }[]>`
			SELECT Emoji AS emoji
			FROM PostReaction
			WHERE PostID = ${postId} AND AccountID = ${accountId};
		`;
		return result.length > 0 ? result[0].emoji : null;
	}
}
