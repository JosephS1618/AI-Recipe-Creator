import { type ApiResponse, apiClient } from "./request.utils";

export interface EmojiData {
	emoji: string;
	kind: string;
}

export async function getAvailableEmojis(): Promise<EmojiData[]> {
	const response =
		await apiClient.get<ApiResponse<EmojiData[]>>("/post/emoji/list");
	return response.data.data;
}

export async function addReaction(
	postId: string,
	emoji: string,
): Promise<{ success: boolean }> {
	const response = await apiClient.post<ApiResponse<{ success: boolean }>>(
		`/post/${postId}/reaction/add`,
		{ emoji },
	);
	return response.data.data;
}

export async function removeReaction(
	postId: string,
): Promise<{ success: boolean }> {
	const response = await apiClient.delete<ApiResponse<{ success: boolean }>>(
		`/post/${postId}/reaction/delete`,
	);
	return response.data.data;
}
