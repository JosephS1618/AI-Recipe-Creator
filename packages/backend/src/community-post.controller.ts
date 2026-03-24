import { Controller, Get } from "@nestjs/common";
import { CommunityPostService } from "./community-post.service";

@Controller()
export class CommunityPostController {
	constructor(private readonly service: CommunityPostService) {}

	@Get("posts")
	list() {
		return this.service.list();
	}
}
