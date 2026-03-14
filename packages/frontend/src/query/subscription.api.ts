import { type ApiResponse, apiClient } from "./request.utils";
import type {
	SubscribeInput,
	SubscribeResponse,
	Subscription,
} from "./subscription.types";

export async function listSubscriptions(): Promise<Subscription[]> {
	const response =
		await apiClient.get<ApiResponse<Subscription[]>>("/subscription/list");
	return response.data.data;
}

export async function subscribeAccount(
	input: SubscribeInput,
): Promise<SubscribeResponse> {
	const response = await apiClient.post<ApiResponse<SubscribeResponse>>(
		"/subscription/subscribe",
		input,
	);
	return response.data.data;
}
