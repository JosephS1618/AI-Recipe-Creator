import { Link, useNavigate, useParams } from "react-router";
import { toast } from "sonner";
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
import { useDeleteRecipe, useGetRecipe } from "@/query";

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

	const { data: recipe } = useGetRecipe(recipeId);
	const deleteRecipe = useDeleteRecipe();

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

					<Button
						variant="outline"
						className="text-destructive hover:text-destructive"
						disabled={deleteRecipe.isPending}
						onClick={() => {
							if (!recipe?.recipe_id) return;

							deleteRecipe.mutate(recipe.recipe_id, {
								onSuccess: () => {
									toast.success("Recipe deleted");
									navigate("/recipes");
								},
							});
						}}
					>
						{"Delete Recipe"}
					</Button>
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

					{/* STATS ROW */}
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
						<div className="text-sm text-muted-foreground mb-2">
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
					{recipe?.ingredients.length === 0 ? (
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
									{recipe?.ingredients.map((ingredient, index) => (
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
		</div>
	);
}
