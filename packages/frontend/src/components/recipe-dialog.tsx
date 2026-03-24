import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
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
import { type RecipeIngredient, useFetchIngredients } from "@/query";

type RecipeFormData = {
	name: string;
	content: string;
	cuisine: string | null;
	cost_in_cents: number;
	time: number;
	ingredients: RecipeIngredient[];
};

type RecipeDialogProps = {
	openRecipeDialog: boolean;
	toggleOpenRecipeDialog: (openRecipeDialog: boolean) => void;
	onSubmit: (data: RecipeFormData) => void;
	title?: string;
	submitLabel?: string;
	passedValues?: RecipeFormData | null;
};

type IngredientRow = RecipeIngredient & {
	rowId: string;
};

const createIngredientRow = (
	ingredient?: Partial<RecipeIngredient>,
): IngredientRow => ({
	rowId: crypto.randomUUID(),
	ingredient_name: ingredient?.ingredient_name ?? "",
	quantity: ingredient?.quantity ?? 1,
});

export const RecipeDialog = (props: RecipeDialogProps) => {
	const title = props.title ?? "Create Recipe";
	const disclaimer =
		"Only ingredients already added to the ingredients table can be used in recipes";
	const submitLabel = props.submitLabel ?? "Create";

	const { data: everyIngredientInDatabase = [] } = useFetchIngredients();

	const [recipeName, setRecipeName] = useState("");
	const [recipeDescription, setRecipeDescription] = useState("");
	const [cuisine, setCuisine] = useState("");
	const [cost, setCost] = useState(0);
	const [time, setTime] = useState(0);
	const [ingredients, setIngredients] = useState<IngredientRow[]>([]);

	useEffect(() => {
		if (!props.openRecipeDialog) return;

		setRecipeName(props.passedValues?.name?.trim() ?? "");
		setRecipeDescription(props.passedValues?.content?.trim() ?? "");
		setCuisine(props.passedValues?.cuisine?.trim() ?? "");
		setCost(props.passedValues?.cost_in_cents ?? 0);
		setTime(props.passedValues?.time ?? 0);

		const recipeIngredients = props.passedValues?.ingredients ?? [];

		setIngredients(
			recipeIngredients.map((ingredient) => createIngredientRow(ingredient)),
		);
	}, [props.openRecipeDialog, props.passedValues]);

	const listOfIngredients = everyIngredientInDatabase
		.map((ingredient) => ingredient.name.trim())
		.filter((name) => name.length > 0)
		.sort();

	const selectedNames = ingredients
		.map((ingredient) => ingredient.ingredient_name)
		.filter((name) => name.length > 0);

	const canNOTAddIngredientANYMORE =
		selectedNames.length >= listOfIngredients.length;

	const setIngredientName = (index: number, name: string) => {
		const updatedIngredients = [];

		for (let i = 0; i < ingredients.length; i++) {
			if (i === index) {
				updatedIngredients.push({
					rowId: ingredients[i].rowId,
					ingredient_name: name,
					quantity: ingredients[i].quantity,
				});
			} else {
				updatedIngredients.push(ingredients[i]);
			}
		}

		setIngredients(updatedIngredients);
	};

	const setIngredientQty = (index: number, qty: number) => {
		const updatedIngredients = [];

		for (let i = 0; i < ingredients.length; i++) {
			if (i === index) {
				updatedIngredients.push({
					rowId: ingredients[i].rowId,
					ingredient_name: ingredients[i].ingredient_name,
					quantity: qty,
				});
			} else {
				updatedIngredients.push(ingredients[i]);
			}
		}

		setIngredients(updatedIngredients);
	};

	function addIngredient() {
		setIngredients([...ingredients, createIngredientRow()]);
	}

	const removeIngredient = (index: number) => {
		const updatedIngredients = [];

		for (let i = 0; i < ingredients.length; i++) {
			if (i !== index) {
				updatedIngredients.push(ingredients[i]);
			}
		}

		setIngredients(updatedIngredients);
	};

	const readyToSubmit =
		recipeName.trim().length > 0 &&
		ingredients.length > 0 &&
		ingredients.every(
			(ingredient) => ingredient.ingredient_name.trim().length > 0,
		);

	const handleSubmit = () => {
		if (!readyToSubmit) {
			return;
		}

		props.onSubmit({
			name: recipeName.trim(),
			content: recipeDescription.trim(),
			cuisine: cuisine.trim() || null,
			cost_in_cents: cost,
			time: time,
			ingredients: ingredients.map((ingredient) => ({
				ingredient_name: ingredient.ingredient_name,
				quantity: ingredient.quantity,
			})),
		});
	};

	return (
		<Dialog
			open={props.openRecipeDialog}
			onOpenChange={props.toggleOpenRecipeDialog}
		>
			<DialogContent className="max-h-screen overflow-y-auto">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{disclaimer}</DialogDescription>
				</DialogHeader>

				<div className="grid gap-4 py-2">
					<div className="grid gap-2">
						<Label htmlFor="recipe-name">Name</Label>
						<Input
							id="recipe-name"
							value={recipeName}
							onChange={(e) => setRecipeName(e.target.value)}
							placeholder="Recipe name"
						/>
					</div>
				</div>

				<div className="grid gap-2">
					<Label htmlFor="recipe-content">Content</Label>
					<Textarea
						id="recipe-content"
						value={recipeDescription}
						onChange={(e) => setRecipeDescription(e.target.value)}
						placeholder="Recipe description and instructions"
						rows={6}
					/>
				</div>

				<div className="grid gap-4 md:grid-cols-3">
					<div className="grid gap-2">
						<Label htmlFor="recipe-cuisine">Cuisine</Label>
						<Input
							id="recipe-cuisine"
							value={cuisine}
							onChange={(e) => setCuisine(e.target.value)}
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="recipe-time">Time (minutes)</Label>
						<Input
							id="recipe-time"
							type="number"
							min={0}
							value={time}
							onChange={(e) => {
								const time = e.currentTarget.valueAsNumber;
								setTime(Number.isNaN(time) ? 0 : time);
							}}
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="recipe-cost-in-cents">Cost (in cents)</Label>
						<Input
							id="recipe-cost-in-cents"
							type="number"
							min={0}
							value={cost}
							onChange={(e) => {
								const cost = e.currentTarget.valueAsNumber;
								setCost(Number.isNaN(cost) ? 0 : cost);
							}}
						/>
					</div>
				</div>

				<div className="grid gap-3">
					<div className="font-medium">Ingredients</div>

					{ingredients.map((ingredient, index) => {
						const availableIngredients = listOfIngredients.filter(
							(dropdownOption) => {
								const alreadyUsedInAnotherRow = ingredients.some(
									(otherIngredient, otherIndex) =>
										otherIndex !== index &&
										otherIngredient.ingredient_name === dropdownOption,
								);

								return !alreadyUsedInAnotherRow;
							},
						);

						return (
							<div
								key={ingredient.rowId}
								className="grid gap-3 md:grid-cols-[1fr_0.3fr_auto]"
							>
								<Select
									value={ingredient.ingredient_name}
									onValueChange={(value) => setIngredientName(index, value)}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select ingredient" />
									</SelectTrigger>

									<SelectContent>
										{availableIngredients.map((dropdownOption) => (
											<SelectItem key={dropdownOption} value={dropdownOption}>
												{dropdownOption}
											</SelectItem>
										))}
									</SelectContent>
								</Select>

								<Input
									type="number"
									min={1}
									value={ingredient.quantity}
									onChange={(e) => {
										const qty = e.currentTarget.valueAsNumber;
										setIngredientQty(index, Number.isNaN(qty) ? 1 : qty);
									}}
								/>

								<Button
									type="button"
									variant="outline"
									onClick={() => removeIngredient(index)}
								>
									Remove
								</Button>
							</div>
						);
					})}

					<Button
						type="button"
						variant="outline"
						disabled={canNOTAddIngredientANYMORE}
						onClick={addIngredient}
					>
						Add Ingredient
					</Button>
				</div>

				<DialogFooter>
					<Button
						type="button"
						variant="outline"
						onClick={() => props.toggleOpenRecipeDialog(false)}
					>
						Cancel
					</Button>

					<Button
						type="button"
						onClick={handleSubmit}
						disabled={!readyToSubmit}
					>
						{submitLabel}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
