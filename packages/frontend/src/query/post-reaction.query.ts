import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	addReaction,
	getAvailableEmojis,
	removeReaction,
} from "./post-reaction.api";

export function useAvailableEmojis() {
	return useQuery({
		queryKey: ["emojis"],
		queryFn: getAvailableEmojis,
		staleTime: Infinity,
	});
}

export function useAddReaction() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ postId, emoji }: { postId: string; emoji: string }) =>
			addReaction(postId, emoji),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
	});
}

export function useRemoveReaction() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (postId: string) => removeReaction(postId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
	});
}
