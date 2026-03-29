"use client";

import { Button } from "@/components/ui/button";
import {
	useAddReaction,
	useAvailableEmojis,
	useRemoveReaction,
} from "@/query/post-reaction.query";

export interface PostReactionProps {
	postId: string;
	userReaction?: string | null;
}

export function PostReaction({ postId, userReaction }: PostReactionProps) {
	const { data: emojis, isLoading } = useAvailableEmojis();
	const addReactionMutation = useAddReaction();
	const removeReactionMutation = useRemoveReaction();

	if (isLoading || !emojis) {
		return <div className="h-8" />;
	}

	const handleEmojiClick = (emoji: string) => {
		if (userReaction === emoji) {
			// Remove reaction if clicking the same emoji
			removeReactionMutation.mutate(postId);
		} else {
			// Add or change reaction
			addReactionMutation.mutate({ postId, emoji });
		}
	};

	return (
		<div className="flex gap-2 flex-wrap">
			{emojis.map((emojiData) => (
				<Button
					key={emojiData.emoji}
					variant={userReaction === emojiData.emoji ? "default" : "ghost"}
					size="sm"
					onClick={() => handleEmojiClick(emojiData.emoji)}
					disabled={
						addReactionMutation.isPending || removeReactionMutation.isPending
					}
					className="text-base"
				>
					{emojiData.emoji}
				</Button>
			))}
		</div>
	);
}
