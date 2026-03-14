import { useMutation, useQuery } from "@tanstack/react-query";

import { listSubscriptions, subscribeAccount } from "./subscription.api";
import type {
	SubscribeInput,
	SubscribeResponse,
	Subscription,
} from "./subscription.types";

export const useSubscriptions = () => {
	return useQuery<Subscription[], Error>({
		queryKey: ["subscriptions"],
		queryFn: listSubscriptions,
	});
};

export const useSubscribe = () => {
	return useMutation<SubscribeResponse, Error, SubscribeInput>({
		mutationFn: subscribeAccount,
	});
};
