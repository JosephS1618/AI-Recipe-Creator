import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "sonner";
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

const formatDate = (date?: string | null) => (date ? date.slice(0, 10) : "—");

const formatCost = (cost?: number | null) =>
	cost == null ? "—" : `$${(cost / 100).toFixed(2)}`;

export const RecipeDetailPage = () => {
	const { recipeId = "" } = useParams();
	const navigate = useNavigate();
	const { currentUser } = useAccountSession();

	const [recipeDialog, toggleRecipeDialog] = useState(false);

	const { data: recipe } = useGetRecipe(recipeId);
	const deleteRecipe = useDeleteRecipe();
	const updateRecipe = useUpdateRecipe();

	const isRecipeOwner =
		!!currentUser && recipe?.account_id === currentUser.accountId;

	return (
		<div className="px-4 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">Recipe Detail</h1>
					<p className="text-sm text-muted-foreground">Recipe ID: {recipeId}</p>
				</div>

				<div className="flex gap-2">
					<Button asChild variant="outline">
						<Link to="/recipes">Back</Link>
					</Button>

					{isRecipeOwner && (
						<>
							<Button
								variant="outline"
								onClick={() => toggleRecipeDialog(true)}
							>
								Edit
							</Button>
							<Button
								variant="outline"
								className="text-destructive hover:text-destructive"
								onClick={() => {
									deleteRecipe.mutate(recipe.recipe_id, {
										onSuccess: () => {
											navigate("/recipes");
										},
										onError: () => {
											toast.error("Error: Failed to Delete Recipe");
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
					<CardTitle>{recipe?.name}</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="grid gap-4 text-sm md:grid-cols-5">
						<div>
							<div className="text-muted-foreground">Cost</div>
							<div>{formatCost(recipe?.cost_in_cents)}</div>
						</div>
						<div>
							<div className="text-muted-foreground">Time</div>
							<div>{recipe?.time} minutes</div>
						</div>
						<div>
							<div className="text-muted-foreground">Cusine</div>
							<div>{recipe?.cuisine ?? "-"}</div>
						</div>
						<div>
							<div className="text-muted-foreground">Created</div>
							<div>{formatDate(recipe?.creation_date)}</div>
						</div>
						<div>
							<div className="text-muted-foreground">Modified</div>
							<div>{formatDate(recipe?.modification_date)}</div>
						</div>
					</div>
					<div>
						<div className="mb-2 text-sm text-muted-foreground">
							Description
						</div>
						<div className="whitespace-pre-wrap">{recipe?.content}</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Ingredients Used</CardTitle>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>Quantity</TableHead>
							</TableRow>
						</TableHeader>

						<TableBody>
							{recipe?.ingredients.map((ingredient, index) => (
								<TableRow key={`${ingredient.ingredient_name}-${index}`}>
									<TableCell>{ingredient.ingredient_name}</TableCell>
									<TableCell>{ingredient.quantity}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
			{isRecipeOwner && (
				<RecipeDialog
					openRecipeDialog={recipeDialog}
					toggleOpenRecipeDialog={toggleRecipeDialog}
					title="Update Recipe"
					submitLabel="Save"
					passedValues={{
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
								...data,
							},
							{
								onSuccess: () => {
									toggleRecipeDialog(false);
								},
								onError: () => {
									toast.error("Error: Failed to Update Recipe");
								},
							},
						);
					}}
				/>
			)}
		</div>
	);
};
