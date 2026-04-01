import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { CreateCommunityPostDto } from "./community-post.dto";
import { CommunityPostService } from "./community-post.service";

import { CurrentAccountId } from "./decorators/current-account-id";

@Controller()
export class CommunityPostController {
	constructor(private readonly service: CommunityPostService) {}

	@Get("posts")
	list(@CurrentAccountId() accountId: string) {
		return this.service.list(accountId);
	}

	@Get("posts/search")
	search(
		@Query("recipeName") recipeName: string,
		@CurrentAccountId() accountId: string,
	) {
		return this.service.searchByRecipeName(recipeName, accountId);
	}

	@Post("posts/create")
	create(
		@CurrentAccountId() accountId: string,
		@Body() body: CreateCommunityPostDto,
	) {
		return this.service.create({
			...body,
			account_id: accountId,
		});
	}
}
