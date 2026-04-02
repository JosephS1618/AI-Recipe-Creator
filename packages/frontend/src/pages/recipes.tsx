import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { RecipeDialog } from "@/components/recipe-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
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
	useGenerateAiRecipe,
	useGetIngredientCountsByRecipe,
	useGetIngredientsUsedInAllRecipes,
	useGetRecipes,
} from "@/query";

const formatDate = (date?: string | null) => (date ? date.slice(0, 10) : "—");

const formatCost = (cost?: number | null) =>
	cost == null ? "—" : `$${(cost / 100).toFixed(2)}`;

export const Recipes = () => {
	const [displayDialog, setDisplayDialog] = useState(false);
	const [proteinLevel, setProteinLevel] = useState("proteinLevelNotSelected");
	const navigate = useNavigate();

	let minTotalProtein: number | undefined;

	if (proteinLevel === "proteinOver10") {
		minTotalProtein = 10;
	}

	if (proteinLevel === "proteinOver50") {
		minTotalProtein = 50;
	}

	const { data: recipes = [] } = useGetRecipes({ minTotalProtein });
	const {
		data: ingredientCountsByRecipe = [],
		refetch: fetchIngredientCountsByRecipe,
	} = useGetIngredientCountsByRecipe();
	const {
		data: ingredientsUsedInAllRecipes = [],
		refetch: fetchIngredientsUsedInAllRecipes,
	} = useGetIngredientsUsedInAllRecipes();

	const createRecipe = useCreateRecipe();
	const generateAiRecipe = useGenerateAiRecipe();

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
		});
	};

	const handleGenerateAiRecipe = () => {
		const recipeToastId = toast.loading("Generating recipe with AI...");

		generateAiRecipe.mutate(undefined, {
			onSuccess: (recipe) => {
				toast.success("Success: Recipe Generated", { id: recipeToastId });
				navigate(`/recipes/${recipe.recipe_id}`);
			},
			onError: () => {
				toast.dismiss(recipeToastId);
			},
		});
	};

	return (
		<div className="px-4 space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold">Recipes</h1>
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						onClick={handleGenerateAiRecipe}
						disabled={generateAiRecipe.isPending}
					>
						Generate By AI
					</Button>
					<Button onClick={() => setDisplayDialog(true)}>Create Recipe</Button>
				</div>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Recipe List</CardTitle>
					<div className="mt-2 mb-2 flex items-center justify-end">
						<Label htmlFor="protein-dropdown" className="pr-4">
							Filter by Protein Level:{" "}
						</Label>
						<Select value={proteinLevel} onValueChange={setProteinLevel}>
							<SelectTrigger id="protein-dropdown" className="w-56">
								<SelectValue placeholder="Filter by protein" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="proteinLevelNotSelected">
									All recipes
								</SelectItem>
								<SelectItem value="proteinOver10">
									over 10g of Protein
								</SelectItem>
								<SelectItem value="proteinOver50">
									over 50g of Protein
								</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardHeader>
				<CardContent>
					{recipes.length === 0 ? (
						<p className="text-sm text-muted-foreground">No Recipes Found</p>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Name</TableHead>
									<TableHead>Cuisine</TableHead>
									<TableHead>Time</TableHead>
									<TableHead>Cost</TableHead>
									{minTotalProtein && <TableHead>Protein</TableHead>}
									<TableHead>Created</TableHead>
									<TableHead>Updated</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{recipes.map((recipe) => (
									<TableRow key={recipe.recipe_id}>
										<TableCell>
											<Link
												to={`/recipes/${recipe.recipe_id}`}
												className="hover:underline"
											>
												{recipe.name}
											</Link>
										</TableCell>
										<TableCell>{recipe.cuisine ?? "—"}</TableCell>
										<TableCell>{recipe.time}</TableCell>
										<TableCell>{formatCost(recipe.cost_in_cents)}</TableCell>
										{minTotalProtein && (
											<TableHead>{recipe.total_protein}</TableHead>
										)}
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

			<Card>
				<CardContent className="space-y-4">
					<Button
						variant="outline"
						onClick={() => fetchIngredientCountsByRecipe()}
					>
						Show Ingredient Counts By Recipe
					</Button>
					<ul className="list-disc pl-6">
						{ingredientCountsByRecipe.map((recipe) => (
							<li key={recipe.recipe_id}>
								{recipe.recipe_name}: {recipe.ingredient_count}
							</li>
						))}
					</ul>
				</CardContent>
			</Card>

			<Card>
				<CardContent className="space-y-4">
					<Button
						variant="outline"
						onClick={() => fetchIngredientsUsedInAllRecipes()}
					>
						Find Ingredients Used In All Recipes
					</Button>
					<ul className="list-disc pl-6">
						{ingredientsUsedInAllRecipes.map((ingredient) => (
							<li key={ingredient.ingredient_name}>
								{ingredient.ingredient_name}
							</li>
						))}
					</ul>
				</CardContent>
			</Card>

			<RecipeDialog
				openRecipeDialog={displayDialog}
				toggleOpenRecipeDialog={setDisplayDialog}
				onSubmit={handleCreateRecipe}
			/>
		</div>
	);
};
