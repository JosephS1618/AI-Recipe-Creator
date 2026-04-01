import type {
	CommunityPostBody,
	CommunityPostItem,
} from "./community-post.types";
import { type ApiResponse, apiClient } from "./request.utils";

export async function listPosts(): Promise<CommunityPostItem[]> {
	const response =
		await apiClient.get<ApiResponse<CommunityPostItem[]>>("/posts");
	return response.data.data;
}

export async function createPost(postBody: CommunityPostBody): Promise<void> {
	const response = await apiClient.post<ApiResponse<void>>(
		"/posts/create",
		postBody,
	);
	return response.data.data;
}

export async function searchPosts(
	recipeName: string,
): Promise<CommunityPostItem[]> {
	const response = await apiClient.get<ApiResponse<CommunityPostItem[]>>(
		"/posts/search",
		{
			params: { recipeName },
		},
	);
	return response.data.data;
}
