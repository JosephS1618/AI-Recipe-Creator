import { useState } from "react";
import { toast } from "sonner";
import { useAccountSession } from "@/components/account-provider";
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
	const { data: recipes = [] } = useGetRecipes();
	const { data: posts = [] } = useGetPosts();
	const [showCreatePostForm, toggleCreatePostForm] = useState(false);

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
					toggleCreatePostForm(false);
				},
				onError: () => {
					toast.error("Error: Failed to Create Post");
				},
			},
		);
	};

	return (
		<div className="px-4 space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold">Community Posts</h1>
				{currentUser && (
					<Button onClick={() => toggleCreatePostForm(true)}>
						Create Post
					</Button>
				)}
			</div>

			{showCreatePostForm && (
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
											<SelectItem
												key={recipe.recipe_id}
												value={recipe.recipe_id}
											>
												{recipe.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
					</CardContent>

					<CardFooter className="flex justify-end gap-2">
						<Button
							variant="outline"
							onClick={() => {
								toggleCreatePostForm(false);
								resetCreatePostForm();
							}}
						>
							Cancel
						</Button>

						<Button onClick={handleCreatePost}>Post</Button>
					</CardFooter>
				</Card>
			)}

			<Card>
				<CardHeader>
					<CardTitle>Community Posts</CardTitle>
				</CardHeader>
				<CardContent>
					<Table>
						<TableBody>
							{posts.map((post) => (
								<TableRow key={post.post_id}>
									<TableCell>{post.title}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
};
