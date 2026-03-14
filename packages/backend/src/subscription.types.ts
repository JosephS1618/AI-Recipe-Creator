import { z } from "zod";

export const SubscriptionTypeEnum = z.enum(["monthly", "yearly"]);

export const SubscriptionSchema = z.object({
	subscriptionType: SubscriptionTypeEnum,
	subscriptionPriceInCents: z.number().int().positive(),
});

export type SubscriptionType = z.infer<typeof SubscriptionTypeEnum>;
export type Subscription = z.infer<typeof SubscriptionSchema>;

export const SubscribeRequestSchema = z.object({
	subscriptionType: SubscriptionTypeEnum,
});

export type SubscribeRequest = z.infer<typeof SubscribeRequestSchema>;
