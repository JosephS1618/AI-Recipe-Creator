import { useState } from "react";
import { toast } from "sonner";
import { useAccountSession } from "@/components/account-provider";
import { PostReaction } from "@/components/post-reaction";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useCreatePost, useGetPosts, useGetRecipes } from "@/query";

export const CommunityPost = () => {
	return (
		<div className="px-4 space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold">Community Posts</h1>
			</div>
			<CreatePostForm />
			<PostListWithDetail />
		</div>
	);
};

function CreatePostForm() {
	const { data: recipes = [] } = useGetRecipes();
	const [postTitle, setPostTitle] = useState("");
	const [postContent, setPostContent] = useState("");
	const [postVisibility, setPostVisibility] = useState<"public" | "private">(
		"private",
	);
	const [recipeId, setRecipeId] = useState<string | null>(null);
	const { currentUser } = useAccountSession();
	const createPost = useCreatePost();

	const resetCreatePostForm = () => {
		setPostTitle("");
		setPostContent("");
		setPostVisibility("private");
		setRecipeId(null);
	};

	const handleCreatePost = () => {
		if (!postTitle.trim() || !postContent.trim()) {
			toast.error("Please fill in title and content");
			return;
		}

		createPost.mutate(
			{
				title: postTitle.trim(),
				body: postContent.trim(),
				visibility: postVisibility,
				recipe_id: recipeId,
			},
			{
				onSuccess: () => {
					toast.success("Success: Post Created");
					resetCreatePostForm();
				},
			},
		);
	};

	if (!currentUser) {
		return null;
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Create a Post</CardTitle>
			</CardHeader>

			<CardContent className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="post-title">Title</Label>
					<Input
						id="post-title"
						value={postTitle}
						placeholder="Add a Title"
						onChange={(e) => setPostTitle(e.target.value)}
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="post-content">Content</Label>
					<Textarea
						id="post-content"
						value={postContent}
						placeholder="Add Post Content"
						rows={4}
						onChange={(e) => setPostContent(e.target.value)}
					/>
				</div>

				<div className="flex gap-20 items-end pt-1">
					<div className="space-y-2">
						<Label htmlFor="post-visibility">Post Visibility</Label>
						<Select
							value={postVisibility}
							onValueChange={(value: "public" | "private") =>
								setPostVisibility(value)
							}
						>
							<SelectTrigger id="post-visibility">
								<SelectValue placeholder="Choose Post Visibility" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="public">Public</SelectItem>
								<SelectItem value="private">Private</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-2">
						<Label htmlFor="post-recipe">Recipe</Label>
						<Select
							value={recipeId ?? undefined}
							onValueChange={(value) => setRecipeId(value)}
						>
							<SelectTrigger id="post-recipe">
								<SelectValue placeholder="Recipe" />
							</SelectTrigger>
							<SelectContent>
								{recipes.map((recipe) => (
									<SelectItem key={recipe.recipe_id} value={recipe.recipe_id}>
										{recipe.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>
			</CardContent>

			<CardFooter className="flex justify-end gap-2">
				<Button onClick={handleCreatePost}>Post</Button>
			</CardFooter>
		</Card>
	);
}

function PostListWithDetail() {
	const { data: recipes = [] } = useGetRecipes();
	const { data: posts = [] } = useGetPosts();
	const [selectedPostId, setSelectedPostId] = useState("");

	const selectedPost = posts.find((post) => post.post_id === selectedPostId);
	const selectedPostRecipe = recipes.find(
		(recipe) => recipe.recipe_id === selectedPost?.recipe_id,
	);

	return (
		<div className="flex gap-8">
			<Card className="w-1/3">
				<CardHeader>
					<CardTitle>Community Posts</CardTitle>
				</CardHeader>
				<CardContent>
					<Table>
						<TableBody>
							{posts.map((post) => (
								<TableRow
									key={post.post_id}
									className="cursor-pointer hover:bg-muted"
									onClick={() => setSelectedPostId(post.post_id)}
								>
									<TableCell>{post.title}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			{selectedPost && (
				<Card className="w-2/3">
					<CardContent className="space-y-4">
						<div className="text-xs text-muted-foreground ">
							{selectedPostRecipe?.name?.trim()
								? `Recipe: ${selectedPostRecipe?.name}`
								: "NO RECIPE"}
						</div>
					</CardContent>
					<CardHeader>
						<CardTitle>{selectedPost.title}</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">{selectedPost.body}</div>
						<div className="pt-4 border-t">
							<PostReaction
								postId={selectedPost.post_id}
								userReaction={selectedPost.user_reaction}
							/>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
