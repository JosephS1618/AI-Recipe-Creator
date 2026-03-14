import { Body, Controller, Get, Post } from "@nestjs/common";
import { createZodDto } from "nestjs-zod";

import { type AccountSummary } from "./auth.service";
import { CurrentAccountId } from "./decorators/current-account-id";
import { SubscriptionService } from "./subscription.service";
import {
	SubscribeRequestSchema,
	type Subscription,
} from "./subscription.types";

export class SubscribeRequestDto extends createZodDto(SubscribeRequestSchema) {}

@Controller("subscription")
export class SubscriptionController {
	constructor(private readonly service: SubscriptionService) {}

	@Get("list")
	async listSubscriptions(): Promise<Subscription[]> {
		return this.service.listSubscriptions();
	}

	@Post("subscribe")
	async subscribeAccount(
		@CurrentAccountId() accountId: string,
		@Body() input: SubscribeRequestDto,
	): Promise<AccountSummary> {
		return this.service.subscribeAccount(accountId, input.subscriptionType);
	}
}
