import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useAccountSession } from "@/components/account-provider";
import { RecipeDialog } from "@/components/recipe-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useDeleteRecipe, useGetRecipe, useUpdateRecipe } from "@/query";

function formatDate(value: string | null | undefined) {
	return value ? value.slice(0, 10) : "—";
}

function formatCost(cost: number | null | undefined) {
	if (cost == null) return "—";
	return `$${(cost / 100).toFixed(2)}`;
}

export function RecipeDetailPage() {
	const { recipeId = "" } = useParams();
	const navigate = useNavigate();
	const { currentUser } = useAccountSession();

	const [updateRecipeOpen, setUpdateRecipeOpen] = useState(false);

	const { data: recipe } = useGetRecipe(recipeId);
	const deleteRecipe = useDeleteRecipe();
	const updateRecipe = useUpdateRecipe();

	const isRecipeOwner =
		Boolean(recipe) &&
		Boolean(currentUser) &&
		recipe?.account_id === currentUser?.accountId;

	return (
		<div className="max-w-6xl space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Recipe Detail</h1>
					<p className="mt-1 text-muted-foreground">
						Recipe ID: {recipe?.recipe_id}
					</p>
				</div>

				<div className="flex gap-2">
					<Button asChild variant="outline">
						<Link to="/recipes">Back to Recipes</Link>
					</Button>

					{isRecipeOwner && (
						<>
							<Button
								variant="outline"
								onClick={() => setUpdateRecipeOpen(true)}
							>
								Update
							</Button>

							<Button
								variant="outline"
								className="text-destructive hover:text-destructive"
								onClick={() => {
									if (!recipe?.recipe_id) return;

									deleteRecipe.mutate(recipe.recipe_id, {
										onSuccess: () => {
											navigate("/recipes");
										},
									});
								}}
							>
								Delete
							</Button>
						</>
					)}
				</div>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Recipe Information</CardTitle>
				</CardHeader>

				<CardContent className="space-y-6">
					<div>
						<div className="text-sm text-muted-foreground">Name</div>
						<div className="font-medium">{recipe?.name}</div>
					</div>

					<div className="grid gap-4 grid-cols-2 md:grid-cols-5">
						<div>
							<div className="text-sm text-muted-foreground">Cost</div>
							<div className="text-sm">{formatCost(recipe?.cost_in_cents)}</div>
						</div>

						<div>
							<div className="text-sm text-muted-foreground">Time</div>
							<div className="text-sm">{recipe?.time} min</div>
						</div>

						<div>
							<div className="text-sm text-muted-foreground">Cuisine</div>
							<div className="text-sm">{recipe?.cuisine ?? "—"}</div>
						</div>

						<div>
							<div className="text-sm text-muted-foreground">Date Created</div>
							<div className="text-sm">{formatDate(recipe?.creation_date)}</div>
						</div>

						<div>
							<div className="text-sm text-muted-foreground">Date Updated</div>
							<div className="text-sm">
								{formatDate(recipe?.modification_date)}
							</div>
						</div>
					</div>

					<div>
						<div className="mb-2 text-sm text-muted-foreground">
							Description
						</div>
						<div className="rounded-md border p-4 whitespace-pre-wrap break-words">
							{recipe?.content}
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Ingredients Used</CardTitle>
				</CardHeader>

				<CardContent>
					{!recipe?.ingredients || recipe.ingredients.length === 0 ? (
						<p className="text-sm text-muted-foreground">
							Umm.. hmm no ingredients found
						</p>
					) : (
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Ingredient Name</TableHead>
										<TableHead>Quantity</TableHead>
									</TableRow>
								</TableHeader>

								<TableBody>
									{recipe.ingredients.map((ingredient, index) => (
										<TableRow key={`${ingredient.ingredient_name}-${index}`}>
											<TableCell className="text-sm text-muted-foreground">
												{ingredient.ingredient_name}
											</TableCell>
											<TableCell className="text-sm text-muted-foreground">
												{ingredient.quantity}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					)}
				</CardContent>
			</Card>

			{recipe && isRecipeOwner && (
				<RecipeDialog
					open={updateRecipeOpen}
					toggleOpen={setUpdateRecipeOpen}
					title="Update Recipe"
					description="Reminder: Only ingredients already added to the ingredients table can be used in recipes"
					submitLabel="Save"
					initialValues={{
						name: recipe.name,
						content: recipe.content,
						cuisine: recipe.cuisine,
						time: recipe.time,
						ingredients: recipe.ingredients,
					}}
					onSubmit={(data) => {
						updateRecipe.mutate(
							{
								recipe_id: recipe.recipe_id,
								name: data.name,
								content: data.content,
								cuisine: data.cuisine,
								time: data.time,
								ingredients: data.ingredients,
							},
							{
								onSuccess: () => setUpdateRecipeOpen(false),
							},
						);
					}}
				/>
			)}
		</div>
	);
}
