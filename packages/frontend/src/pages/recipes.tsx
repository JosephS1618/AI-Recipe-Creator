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
	type RecipeItem,
	useCreateRecipe,
	useGetRecipes,
} from "@/query";

function formatDate(value: string | null | undefined) {
	return value ? value.slice(0, 10) : "—";
}

function formatCost(cost: number | null | undefined) {
	return cost ? `$${(cost / 100).toFixed(2)}` : "—";
}

function Row({ recipe }: { recipe: RecipeItem }) {
	return (
		<TableRow>
			<TableCell>
				<Link to={`/recipes/${recipe.recipe_id}`}>{recipe.name}</Link>
			</TableCell>
			<TableCell>{recipe.cuisine ?? "—"}</TableCell>
			<TableCell>{recipe.time}</TableCell>
			<TableCell>{formatCost(recipe.cost_in_cents)}</TableCell>
			<TableCell>{formatDate(recipe.creation_date)}</TableCell>
			<TableCell>{formatDate(recipe.modification_date)}</TableCell>
			<TableCell>
				<Button asChild size="sm">
					<Link to={`/recipes/${recipe.recipe_id}`}>View</Link>
				</Button>
			</TableCell>
		</TableRow>
	);
}

export function Recipes() {
	const [open, setOpen] = useState(false);

	const { data: recipes = [] } = useGetRecipes();
	const createRecipe = useCreateRecipe();

	const handleSubmit = (data: CreateRecipeInput) => {
		if (!data.name.trim()) {
			toast.error("Name required");
			return;
		}

		if (data.ingredients.length === 0) {
			toast.error("Add at least 1 ingredient");
			return;
		}

		createRecipe.mutate(data, {
			onSuccess: () => {
				toast.success("Created");
				setOpen(false);
			},
			onError: (e) => {
				toast.error(e.message);
			},
		});
	};

	return (
		<div className="max-w-6xl space-y-6">
			<div className="flex justify-between">
				<h1 className="text-3xl font-bold">Recipes</h1>
				<Button onClick={() => setOpen(true)}>Create Recipe</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Recipes</CardTitle>
				</CardHeader>

				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>Cuisine</TableHead>
								<TableHead>Time</TableHead>
								<TableHead>Cost</TableHead>
								<TableHead>Created</TableHead>
								<TableHead>Updated</TableHead>
								<TableHead />
							</TableRow>
						</TableHeader>

						<TableBody>
							{recipes.map((r) => (
								<Row key={r.recipe_id} recipe={r} />
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			<RecipeDialog
				isOpen={open}
				onOpenChange={setOpen}
				onSubmit={handleSubmit}
			/>
		</div>
	);
}
