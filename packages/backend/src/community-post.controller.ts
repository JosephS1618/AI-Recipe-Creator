import { Body, Controller, Get, Post } from "@nestjs/common";
import { CreateCommunityPostDto } from "./community-post.dto";
import { CommunityPostService } from "./community-post.service";

import { CurrentAccountId } from "./decorators/current-account-id";

@Controller()
export class CommunityPostController {
	constructor(private readonly service: CommunityPostService) {}

	@Get("posts")
	list() {
		return this.service.list();
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
