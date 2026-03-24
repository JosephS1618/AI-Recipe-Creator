import type { CommunityPostItem } from "./community-post.types";
import { type ApiResponse, apiClient } from "./request.utils";

export async function listPosts(): Promise<CommunityPostItem[]> {
	const response =
		await apiClient.get<ApiResponse<CommunityPostItem[]>>("/posts");
	return response.data.data;
}
