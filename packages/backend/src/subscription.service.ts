import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { z } from "zod";
import { type AccountSummary, AccountSummarySchema } from "./auth.service";
import { sql } from "./sql";
import {
	type Subscription,
	type SubscriptionType,
	SubscriptionTypeEnum,
} from "./subscription.types";

@Injectable()
export class SubscriptionService {
	async listSubscriptions(): Promise<Subscription[]> {
		const subscriptions = await sql<Subscription[]>`
			SELECT
				SubscriptionType AS "subscriptionType",
				SubscriptionPriceInCents AS "subscriptionPriceInCents"
			FROM Subscription
			ORDER BY SubscriptionType;
		`;

		return subscriptions;
	}

	async subscribeAccount(
		accountId: string,
		subscriptionType: SubscriptionType,
	): Promise<AccountSummary> {
		// Validate accountId is a valid UUID
		const parsedAccountId = z.string().uuid().safeParse(accountId);
		if (!parsedAccountId.success) {
			throw new BadRequestException("Invalid account ID");
		}

		// Validate subscription type
		const parsedSubType = SubscriptionTypeEnum.safeParse(subscriptionType);
		if (!parsedSubType.success) {
			throw new BadRequestException("Invalid subscription type");
		}

		// Check if account exists
		const [account] = await sql<{ accountId: string }[]>`
			SELECT AccountID AS "accountId"
			FROM Account
			WHERE AccountID = ${parsedAccountId.data};
		`;

		if (!account) {
			throw new UnauthorizedException("Account not found");
		}

		// Check if account is in trial (not already paid)
		const [existingPaidAccount] = await sql<{ accountId: string }[]>`
			SELECT AccountID AS "accountId"
			FROM PaidAccount
			WHERE AccountID = ${parsedAccountId.data};
		`;

		if (existingPaidAccount) {
			throw new BadRequestException("Account is already a paid account");
		}

		// Check if subscription type exists
		const [subscription] = await sql<{ subscriptionType: string }[]>`
			SELECT SubscriptionType AS "subscriptionType"
			FROM Subscription
			WHERE SubscriptionType = ${parsedSubType.data};
		`;

		if (!subscription) {
			throw new BadRequestException("Invalid subscription type");
		}

		// Delete from TrialAccount (trial account transitioning to paid)
		await sql`
			DELETE FROM TrialAccount
			WHERE AccountID = ${parsedAccountId.data};
		`;

		// Insert into PaidAccount
		const now = new Date();
		const endDate = new Date(now);

		// Set subscription end date based on type
		if (parsedSubType.data === "monthly") {
			endDate.setMonth(endDate.getMonth() + 1);
		} else {
			endDate.setFullYear(endDate.getFullYear() + 1);
		}

		await sql`
			INSERT INTO PaidAccount (
				AccountID,
				SubscriptionStartDate,
				SubscriptionEndDate,
				SubscriptionType
			)
			VALUES (
				${parsedAccountId.data},
				${now},
				${endDate},
				${parsedSubType.data}
			);
		`;

		// Return updated account summary
		const [updatedAccount] = await sql<Omit<AccountSummary, "accountType">[]>`
			SELECT
				AccountID AS "accountId",
				Email AS "email",
				Username AS "username"
			FROM Account
			WHERE AccountID = ${parsedAccountId.data};
		`;

		if (!updatedAccount) {
			throw new Error("Failed to retrieve updated account");
		}

		return AccountSummarySchema.parse({
			...updatedAccount,
			accountType: "paid",
		});
	}
}
