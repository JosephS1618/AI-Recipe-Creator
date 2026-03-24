import { useQuery } from "@tanstack/react-query";
import { listPosts } from "./community-post.api";

export function useGetPosts() {
	return useQuery({
		queryKey: ["posts"],
		queryFn: listPosts,
	});
}
