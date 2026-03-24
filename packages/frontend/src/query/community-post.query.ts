import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createPost, listPosts } from "./community-post.api";

import type { CommunityPostBody } from "./community-post.types";

export function useGetPosts() {
	return useQuery({
		queryKey: ["posts"],
		queryFn: listPosts,
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
