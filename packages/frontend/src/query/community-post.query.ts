import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createPost, listPosts, searchPosts } from "./community-post.api";

import type { CommunityPostBody } from "./community-post.types";

export function useGetPosts(recipeName?: string) {
	const trimmedRecipeName = recipeName?.trim() ?? "";

	return useQuery({
		queryKey: ["posts", trimmedRecipeName],
		queryFn: () =>
			trimmedRecipeName ? searchPosts(trimmedRecipeName) : listPosts(),
	});
}

export const useCreatePost = () => {
	const queryClient = useQueryClient();
	const mutation = useMutation<void, Error, CommunityPostBody>({
		mutationFn: createPost,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
	});
	return mutation;
};
