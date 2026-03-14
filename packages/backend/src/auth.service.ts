import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { sql } from "./sql";

export const AccountSummarySchema = z.object({
	accountId: z.string().uuid(),
	email: z.string().email(),
	username: z.string(),
	accountType: z.enum(["trial", "paid", "none"]),
});

export const LoginSchema = z.object({
	email: z.string().trim().email(),
	password: z.string().trim().min(1, "Password is required"),
});

export const RegisterSchema = z.object({
	email: z.string().trim().email(),
	username: z.string().trim().min(1, "Username is required"),
	password: z.string().trim().min(1, "Password is required"),
});

export type AccountSummary = z.infer<typeof AccountSummarySchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;

export class LoginDto extends createZodDto(LoginSchema) {}
export class RegisterDto extends createZodDto(RegisterSchema) {}

@Injectable()
export class AuthService {
	async login(input: LoginInput): Promise<AccountSummary> {
		const [account] = await sql<Omit<AccountSummary, "accountType">[]>`
			SELECT
				AccountID AS "accountId",
				Email AS "email",
				Username AS "username"
			FROM Account
			WHERE Email = ${input.email} AND Password = ${input.password};
		`;

		if (!account) {
			throw new UnauthorizedException("Invalid email or password");
		}

		const [paidAccount] = await sql<{ accountId: string }[]>`
			SELECT AccountID AS "accountId"
			FROM PaidAccount
			WHERE AccountID = ${account.accountId};
		`;

		return AccountSummarySchema.parse({
			...account,
			accountType: paidAccount ? "paid" : "trial",
		});
	}

	async register(input: RegisterInput): Promise<AccountSummary> {
		const trialStartDate = new Date();
		const trialEndDate = new Date(trialStartDate);
		trialEndDate.setDate(trialEndDate.getDate() + 14);

		const [existingAccount] = await sql<{ accountId: string }[]>`
			SELECT AccountID AS "accountId"
			FROM Account
			WHERE Email = ${input.email} OR Username = ${input.username};
		`;

		if (existingAccount) {
			throw new Error("Email or username already exists");
		}

		const [account] = await sql<{ accountId: string }[]>`
			INSERT INTO Account (AccountID, Email, Username, Password)
			VALUES (gen_random_uuid(), ${input.email}, ${input.username}, ${input.password})
			RETURNING AccountID AS "accountId";
		`;

		if (!account) {
			throw new Error("Failed to create account");
		}

		const { accountId } = account;

		await sql`
			INSERT INTO TrialAccount (
				AccountID,
				UsageRemaining,
				TrialStartDate,
				TrialEndDate
			)
			VALUES (${accountId}, 15, ${trialStartDate}, ${trialEndDate});
		`;

		return {
			accountId,
			email: input.email,
			username: input.username,
			accountType: "trial",
		};
	}

	async getCurrentUser(accountId: string): Promise<AccountSummary> {
		const parsedAccountId = z.string().uuid().safeParse(accountId);

		if (!parsedAccountId.success) {
			throw new BadRequestException("Invalid x-account-id header");
		}

		const [account] = await sql<Omit<AccountSummary, "accountType">[]>`
			SELECT
				AccountID AS "accountId",
				Email AS "email",
				Username AS "username"
			FROM Account
			WHERE AccountID = ${parsedAccountId.data};
		`;

		if (!account) {
			throw new UnauthorizedException("Current user not found");
		}

		const [paidAccount] = await sql<{ accountId: string }[]>`
			SELECT AccountID AS "accountId"
			FROM PaidAccount
			WHERE AccountID = ${account.accountId};
		`;

		return AccountSummarySchema.parse({
			...account,
			accountType: paidAccount ? "paid" : "trial",
		});
	}
}
