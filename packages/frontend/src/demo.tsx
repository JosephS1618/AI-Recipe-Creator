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
import { type IngredientItem } from "./api";
import {
	useAddIngredient,
	useEditIngredient,
	useFetchIngredients,
	useRemoveIngredient,
} from "./query";

function IngredientListItem({ ingredient }: { ingredient: IngredientItem }) {
	const removeIngredient = useRemoveIngredient();
	const editIngredient = useEditIngredient();

	const [carbs, setCarbs] = useState(Number(ingredient.carbs));
	const [protein, setProtein] = useState(Number(ingredient.protein));
	const [fat, setFat] = useState(Number(ingredient.fat));

	const [updateMessage, setUpdateMessage] = useState("");

	return (
		<TableRow>
			<TableCell className="font-medium">{ingredient.name}</TableCell>

			<TableCell>
				<Input
					type="number"
					min={0}
					value={carbs}
					onChange={(e) => setCarbs(Math.max(0, Number(e.target.value)))}
					className="w-24"
				/>
			</TableCell>

			<TableCell>
				<Input
					type="number"
					min={0}
					value={protein}
					onChange={(e) => setProtein(Math.max(0, Number(e.target.value)))}
					className="w-24"
				/>
			</TableCell>

			<TableCell>
				<Input
					type="number"
					min={0}
					value={fat}
					onChange={(e) => setFat(Math.max(0, Number(e.target.value)))}
					className="w-24"
				/>
			</TableCell>

			<TableCell>
				<div className="flex gap-2">
					<Button
						variant="default"
						onClick={() => {
							setUpdateMessage("Updating...");

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
										setUpdateMessage("Failed to save");
									},
								},
							);
						}}
					>
						Save
					</Button>

					<Button
						variant="destructive"
						onClick={() => removeIngredient.mutate({ name: ingredient.name })}
					>
						Remove
					</Button>
				</div>

				{updateMessage && (
					<p className="mt-2 text-sm text-muted-foreground">{updateMessage}</p>
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
					<p className="text-sm text-muted-foreground">No ingredients found.</p>
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
						placeholder=""
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
						onChange={(e) => {
							const value = e.currentTarget.valueAsNumber;
							setCarbs(Math.max(0, Number.isNaN(value) ? 0 : value));
						}}
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
						onChange={(e) => {
							const value = e.currentTarget.valueAsNumber;
							setProtein(Math.max(0, Number.isNaN(value) ? 0 : value));
						}}
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
						onChange={(e) => {
							const value = e.currentTarget.valueAsNumber;
							setFat(Math.max(0, Number.isNaN(value) ? 0 : value));
						}}
					/>
				</div>

				<div className="md:col-span-4">
					<Button
						onClick={() =>
							addIngredient.mutate(
								{ name, carbs, protein, fat },
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
						Add Ingredient
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}

export function Demo() {
	return (
		<main className="min-h-screen bg-background p-6 text-foreground">
			<div className="mx-auto flex max-w-5xl flex-col gap-6">
				<IngredientsList />
				<AddIngredient />
			</div>
		</main>
	);
}
