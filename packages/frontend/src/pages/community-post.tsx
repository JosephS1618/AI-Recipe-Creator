import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";

import { useGetRecipes } from "@/query";

export const CommunityPost = () => {
	const { data: recipes = [] } = useGetRecipes();
	const [showCreatePostForm, toggleCreatePostForm] = useState(false);

	return (
		<div className="px-4 space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold">Community Posts</h1>
				<div className="flex items-center gap-2">
					<Button onClick={() => toggleCreatePostForm(true)}>
						Create Post
					</Button>
				</div>
			</div>

			{showCreatePostForm && (
				<Card>
					<CardHeader>
						<CardTitle>Create a Post</CardTitle>
					</CardHeader>

					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="post-title">Title</Label>
							<Input placeholder="Add a Title" />
						</div>

						<div className="space-y-2">
							<Label htmlFor="post-content">Content</Label>
							<Textarea placeholder="Add Post Content" rows={4} />
						</div>

						<div className="space-y-2">
							<Label>Recipe</Label>
							<Select>
								<SelectTrigger>
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
					</CardContent>

					<CardFooter className="flex justify-end gap-2">
						<Button
							variant="outline"
							onClick={() => toggleCreatePostForm(false)}
						>
							Cancel
						</Button>

						<Button>Post</Button>
					</CardFooter>
				</Card>
			)}

			<Card>
				<CardHeader>
					<CardTitle>Community Posts</CardTitle>
				</CardHeader>
				<CardContent></CardContent>
			</Card>
		</div>
	);
};
