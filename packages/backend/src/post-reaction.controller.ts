import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { CurrentAccountId } from "./decorators/current-account-id";
import { EmojiData, PostReactionService } from "./post-reaction.service";

@Controller()
export class PostReactionController {
	constructor(private readonly service: PostReactionService) {}

	@Get("post/emoji/list")
	listEmojis(): Promise<EmojiData[]> {
		return this.service.getAvailableEmojis();
	}

	@Post("post/:post_id/reaction/add")
	async addReaction(
		@Param("post_id") postId: string,
		@CurrentAccountId() accountId: string,
		@Body() body: { emoji: string },
	): Promise<{ success: boolean }> {
		await this.service.addReaction(postId, accountId, body.emoji);
		return { success: true };
	}

	@Delete("post/:post_id/reaction/delete")
	async removeReaction(
		@Param("post_id") postId: string,
		@CurrentAccountId() accountId: string,
	): Promise<{ success: boolean }> {
		await this.service.removeReaction(postId, accountId);
		return { success: true };
	}
}
