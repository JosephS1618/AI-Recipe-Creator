import type { AuthUser } from "./auth.types";

export type SubscriptionType = "monthly" | "yearly";

export type Subscription = {
	subscriptionType: SubscriptionType;
	subscriptionPriceInCents: number;
};

export type SubscribeInput = {
	subscriptionType: SubscriptionType;
};

export type SubscribeResponse = AuthUser;
