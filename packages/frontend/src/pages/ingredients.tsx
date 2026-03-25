import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	type IngredientItem,
	useAddIngredient,
	useAddIngredientByAi,
	useEditIngredient,
	useFetchIngredients,
	useRemoveIngredient,
} from "@/query";

function IngredientListItem({ ingredient }: { ingredient: IngredientItem }) {
	const removeIngredient = useRemoveIngredient();
	const editIngredient = useEditIngredient();

	const [carbs, setCarbs] = useState(Number(ingredient.carbs));
	const [protein, setProtein] = useState(Number(ingredient.protein));
	const [fat, setFat] = useState(Number(ingredient.fat));

	const [updateMessage, setUpdateMessage] = useState("");

	return (
		<TableRow>
			<TableCell>{ingredient.name}</TableCell>

			<TableCell>
				<Input
					type="number"
					min={0}
					value={carbs}
					onChange={(e) => setCarbs(Number(e.target.value))}
					className="w-24"
				/>
			</TableCell>

			<TableCell>
				<Input
					type="number"
					min={0}
					value={protein}
					onChange={(e) => setProtein(Number(e.target.value))}
					className="w-24"
				/>
			</TableCell>

			<TableCell>
				<Input
					type="number"
					min={0}
					value={fat}
					onChange={(e) => setFat(Number(e.target.value))}
					className="w-24"
				/>
			</TableCell>

			<TableCell>
				<div className="flex gap-2">
					<Button
						variant="outline"
						onClick={() => {
							editIngredient.mutate(
								{
									name: ingredient.name,
									carbs,
									protein,
									fat,
								},
								{
									onSuccess: () => {
										setUpdateMessage(`Updated: ${ingredient.name}`);
										setTimeout(() => setUpdateMessage(""), 2250);
									},
									onError: () => {
										setUpdateMessage("Update failed");
									},
								},
							);
						}}
					>
						Update
					</Button>

					<Button
						variant="outline"
						className="text-destructive hover:text-destructive"
						onClick={() => removeIngredient.mutate({ name: ingredient.name })}
					>
						Delete
					</Button>
				</div>

				{updateMessage && (
					<p className="text-sm text-muted-foreground">{updateMessage}</p>
				)}
			</TableCell>
		</TableRow>
	);
}

function IngredientsList() {
	const { data: ingredients = [] } = useFetchIngredients();

	return (
		<Card>
			<CardHeader>
				<CardTitle>Ingredients</CardTitle>
			</CardHeader>

			<CardContent>
				{ingredients.length === 0 ? (
					<p className="text-sm text-muted-foreground">
						Added ingredients will show up here
					</p>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>Carbs</TableHead>
								<TableHead>Protein</TableHead>
								<TableHead>Fat</TableHead>
								<TableHead>Actions</TableHead>
							</TableRow>
						</TableHeader>

						<TableBody>
							{ingredients.map((ingredient) => (
								<IngredientListItem
									key={ingredient.name}
									ingredient={ingredient}
								/>
							))}
						</TableBody>
					</Table>
				)}
			</CardContent>
		</Card>
	);
}

function AddIngredient() {
	const addIngredient = useAddIngredient();

	const [name, setName] = useState("");
	const [carbs, setCarbs] = useState(0);
	const [protein, setProtein] = useState(0);
	const [fat, setFat] = useState(0);
	const trimmedName = name.trim();

	return (
		<Card>
			<CardHeader>
				<CardTitle>Add Ingredient</CardTitle>
			</CardHeader>

			<CardContent className="grid gap-4 md:grid-cols-4">
				<div className="grid gap-2">
					<Label htmlFor="name">Name</Label>
					<Input
						id="name"
						name="name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="Ingredient Name"
					/>
				</div>

				<div className="grid gap-2">
					<Label htmlFor="carbs">Carbs</Label>
					<Input
						id="carbs"
						name="carbs"
						type="number"
						min={0}
						value={carbs}
						onChange={(e) => setCarbs(Number(e.target.value))}
					/>
				</div>

				<div className="grid gap-2">
					<Label htmlFor="protein">Protein</Label>
					<Input
						id="protein"
						name="protein"
						type="number"
						min={0}
						value={protein}
						onChange={(e) => setProtein(Number(e.target.value))}
					/>
				</div>

				<div className="grid gap-2">
					<Label htmlFor="fat">Fat</Label>
					<Input
						id="fat"
						name="fat"
						type="number"
						min={0}
						value={fat}
						onChange={(e) => setFat(Number(e.target.value))}
					/>
				</div>

				<div className="md:col-span-4">
					<Button
						disabled={!trimmedName || addIngredient.isPending}
						onClick={() =>
							addIngredient.mutate(
								{ name: trimmedName, carbs, protein, fat },
								{
									onSuccess: () => {
										setName("");
										setCarbs(0);
										setProtein(0);
										setFat(0);
									},
								},
							)
						}
					>
						{addIngredient.isPending ? "Adding..." : "Add Ingredient"}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}

function AddIngredientByAi() {
	const addIngredientByAi = useAddIngredientByAi();
	const [name, setName] = useState("");
	const trimmedName = name.trim();

	return (
		<Card>
			<CardHeader>
				<CardTitle>Add Ingredient By AI</CardTitle>
			</CardHeader>

			<CardContent className="grid gap-4 md:grid-cols-4">
				<div className="grid gap-2">
					<Label htmlFor="ai-name">Ingredient Name</Label>
					<Input
						id="ai-name"
						name="ai-name"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
				</div>

				<div className="flex items-end">
					<Button
						disabled={!trimmedName || addIngredientByAi.isPending}
						onClick={() =>
							addIngredientByAi.mutate(
								{ name: trimmedName },
								{
									onSuccess: () => {
										setName("");
									},
								},
							)
						}
					>
						{addIngredientByAi.isPending
							? "Generating..."
							: "Add Ingredient By AI"}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}

export function Ingredients() {
	return (
		<div className="px-4 space-y-6">
			<h1 className="text-3xl font-bold">Ingredients</h1>
			<IngredientsList />
			<AddIngredient />
			<AddIngredientByAi />
		</div>
	);
}
