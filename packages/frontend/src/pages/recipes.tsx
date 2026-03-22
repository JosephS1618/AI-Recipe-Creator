import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
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
import {
	type CreateRecipeInput,
	useCreateRecipe,
	useGetRecipes,
} from "@/query";

const formatDate = (date?: string | null) => (date ? date.slice(0, 10) : "—");

const formatCost = (cost?: number | null) =>
	cost == null ? "—" : `$${(cost / 100).toFixed(2)}`;

export const Recipes = () => {
	const [displayDialog, setDisplayDialog] = useState(false);

	const recipesResult = useGetRecipes();
	const recipes = recipesResult.data ?? [];

	const createRecipe = useCreateRecipe();
	const sortedRecipes = [...recipes].sort((a, b) =>
		a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
	);

	const handleCreateRecipe = (data: CreateRecipeInput) => {
		const recipeName = data.name.trim();

		if (!recipeName) {
			toast.error("Error: Missing Name");
			return;
		}

		if (data.ingredients.length === 0) {
			toast.error("Error: Add an Ingredient");
			return;
		}

		createRecipe.mutate(data, {
			onSuccess: () => {
				toast.success("Success: Recipe Created");
				setDisplayDialog(false);
			},
			onError: () => {
				toast.error("Error: Failed to Create Recipe");
			},
		});
	};

	return (
		<div className="max-w-6xl space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold">Recipes</h1>
				<Button onClick={() => setDisplayDialog(true)}>Create Recipe</Button>
			</div>
			<Card>
				<CardHeader>
					<CardTitle>Recipes</CardTitle>
				</CardHeader>
				<CardContent>
					{sortedRecipes.length === 0 ? (
						<p className="text-sm text-muted-foreground">No Recipes Found</p>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Name</TableHead>
									<TableHead>Cuisine</TableHead>
									<TableHead>Time</TableHead>
									<TableHead>Cost</TableHead>
									<TableHead>Created</TableHead>
									<TableHead>Updated</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{sortedRecipes.map((recipe) => (
									<TableRow key={recipe.recipe_id}>
										<TableCell>
											<Link
												to={`/recipes/${recipe.recipe_id}`}
												className="hover:font-semibold"
											>
												{recipe.name}
											</Link>
										</TableCell>
										<TableCell>{recipe.cuisine ?? "—"}</TableCell>
										<TableCell>{recipe.time}</TableCell>
										<TableCell>{formatCost(recipe.cost_in_cents)}</TableCell>
										<TableCell>{formatDate(recipe.creation_date)}</TableCell>
										<TableCell>
											{formatDate(recipe.modification_date)}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>
			<RecipeDialog
				openCreateRecipeDialog={displayDialog}
				toggleOpenCreateRecipeDialog={setDisplayDialog}
				onSubmit={handleCreateRecipe}
			/>
		</div>
	);
};
