import { Body, Controller, Get, Post } from "@nestjs/common";

import {
	type AccountSummary,
	AuthService,
	LoginDto,
	RegisterDto,
} from "./auth.service";
import { CurrentAccountId } from "./decorators/current-account-id";

@Controller("auth")
export class AuthController {
	constructor(private readonly service: AuthService) {}

	@Post("login")
	async login(@Body() input: LoginDto): Promise<AccountSummary> {
		return this.service.login(input);
	}

	@Post("register")
	async register(@Body() input: RegisterDto): Promise<AccountSummary> {
		return this.service.register(input);
	}

	@Get("me")
	async getCurrentUser(
		@CurrentAccountId() accountId: string,
	): Promise<AccountSummary> {
		return this.service.getCurrentUser(accountId);
	}
}
