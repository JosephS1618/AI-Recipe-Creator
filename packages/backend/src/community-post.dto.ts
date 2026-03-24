import { createZodDto } from "nestjs-zod";

import { CommunityPostBodySchema } from "./community-post.types";

export class CreateCommunityPostDto extends createZodDto(
	CommunityPostBodySchema,
) {}
