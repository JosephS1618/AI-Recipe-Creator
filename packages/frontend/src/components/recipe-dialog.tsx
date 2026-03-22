import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
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
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { type RecipeIngredient, useFetchIngredients } from "@/query";

type RecipeDialogProps = {
	open: boolean;
	toggleOpen: (open: boolean) => void;
	onSubmit: (data: {
		name: string;
		content: string;
		cuisine: string | null;
		time: number;
		ingredients: RecipeIngredient[];
	}) => void;
	title?: string;
	description?: string;
	submitLabel?: string;
	initialValues?: {
		name: string;
		content: string;
		cuisine: string | null;
		time: number;
		ingredients: RecipeIngredient[];
	} | null;
};

type IngredientRow = RecipeIngredient & {
	rowId: string;
};

function createIngredientRow(
	ingredient?: Partial<RecipeIngredient>,
): IngredientRow {
	return {
		rowId: crypto.randomUUID(),
		ingredient_name: ingredient?.ingredient_name ?? "",
		quantity: ingredient?.quantity ?? 1,
	};
}

export function RecipeDialog({
	open,
	toggleOpen,
	onSubmit,
	title = "Create Recipe",
	description = "Only ingredients already added to the ingredients table can be used in recipes",
	submitLabel = "Create",
	initialValues = null,
}: RecipeDialogProps) {
	const { data: allIngredients = [] } = useFetchIngredients();

	const [name, setName] = useState("");
	const [content, setContent] = useState("");
	const [cuisine, setCuisine] = useState("");
	const [time, setTime] = useState(0);
	const [ingredients, setIngredients] = useState<IngredientRow[]>([
		createIngredientRow(),
	]);

	useEffect(() => {
		if (!open) return;

		setName(initialValues?.name ?? "");
		setContent(initialValues?.content ?? "");
		setCuisine(initialValues?.cuisine ?? "");
		setTime(initialValues?.time ?? 0);

		if (initialValues?.ingredients && initialValues.ingredients.length > 0) {
			setIngredients(
				initialValues.ingredients.map((ingredient) =>
					createIngredientRow(ingredient),
				),
			);
		} else {
			setIngredients([createIngredientRow()]);
		}
	}, [open, initialValues]);

	const ingredientOptions = allIngredients
		.map((ingredient) => ingredient.name)
		.filter((name) => name.trim() !== "")
		.sort();

	function setIngredientName(index: number, value: string) {
		const updated = [...ingredients];
		updated[index] = {
			...updated[index],
			ingredient_name: value,
		};
		setIngredients(updated);
	}

	function setIngredientQty(index: number, value: number) {
		const updated = [...ingredients];
		updated[index] = {
			...updated[index],
			quantity: value,
		};
		setIngredients(updated);
	}

	function addIngredient() {
		setIngredients([...ingredients, createIngredientRow()]);
	}

	function removeIngredient(index: number) {
		if (ingredients.length === 1) return;
		setIngredients(ingredients.filter((_, i) => i !== index));
	}

	function handleSubmit() {
		if (name.trim() === "") return;

		onSubmit({
			name: name.trim(),
			content: content.trim(),
			cuisine: cuisine.trim() === "" ? null : cuisine.trim(),
			time: Number.isNaN(time) ? 0 : Math.max(0, Math.floor(time)),
			ingredients: ingredients.map(({ rowId, ...ingredient }) => ingredient),
		});
	}

	const disableAddButton = ingredients.some(
		(ingredient) =>
			ingredient.ingredient_name.trim() === "" || ingredient.quantity === 0,
	);

	return (
		<Dialog open={open} onOpenChange={toggleOpen}>
			<DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>

				<div className="grid gap-4 py-2">
					<div className="grid gap-2">
						<Label htmlFor="recipe-name">Name</Label>
						<Input
							id="recipe-name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="Recipe name"
						/>
					</div>

					<div className="grid gap-2">
						<Label htmlFor="recipe-content">Content</Label>
						<textarea
							id="recipe-content"
							value={content}
							onChange={(e) => setContent(e.target.value)}
							rows={6}
							className="min-h-24 rounded-md border bg-background px-3 py-2 text-sm"
							placeholder="Recipe description and instructions"
						/>
					</div>

					<div className="grid gap-4 md:grid-cols-2">
						<div className="grid gap-2">
							<Label htmlFor="recipe-cuisine">Cuisine</Label>
							<Input
								id="recipe-cuisine"
								value={cuisine}
								onChange={(e) => setCuisine(e.target.value)}
								placeholder="Optional"
							/>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="recipe-time">Time</Label>
							<Input
								id="recipe-time"
								type="number"
								min={0}
								value={time}
								onChange={(e) => {
									const value = e.currentTarget.valueAsNumber;
									setTime(Number.isNaN(value) ? 0 : value);
								}}
								placeholder="Minutes"
							/>
						</div>
					</div>

					<div className="grid gap-3">
						<div className="font-medium">Ingredients</div>

						{ingredients.map((ingredient, index) => {
							const validIngredient =
								ingredient.ingredient_name.trim() === "" ||
								ingredientOptions.includes(ingredient.ingredient_name);

							return (
								<div
									key={ingredient.rowId}
									className="grid gap-3 md:grid-cols-[1fr_120px_auto]"
								>
									<div className="grid gap-1">
										<Popover>
											<PopoverTrigger asChild>
												<Button
													type="button"
													variant="outline"
													role="combobox"
													className="w-full justify-between font-normal"
												>
													<span className="truncate">
														{ingredient.ingredient_name || "Select ingredient"}
													</span>
													<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
												</Button>
											</PopoverTrigger>

											<PopoverContent
												className="w-[var(--radix-popover-trigger-width)] p-0"
												align="start"
											>
												<Command>
													<CommandInput placeholder="Search ingredient..." />
													<CommandList>
														<CommandEmpty>Ingredient not found</CommandEmpty>
														<CommandGroup>
															{ingredientOptions.map((option) => (
																<CommandItem
																	key={option}
																	value={option}
																	onSelect={() => {
																		setIngredientName(index, option);
																	}}
																>
																	<Check
																		className={cn(
																			"mr-2 h-4 w-4",
																			ingredient.ingredient_name === option
																				? "opacity-100"
																				: "opacity-0",
																		)}
																	/>
																	{option}
																</CommandItem>
															))}
														</CommandGroup>
													</CommandList>
												</Command>
											</PopoverContent>
										</Popover>

										{!validIngredient && (
											<p className="text-sm text-destructive">
												Choose an ingredient from the ingredients table
											</p>
										)}
									</div>

									<Input
										type="number"
										min={1}
										value={ingredient.quantity}
										onChange={(e) => {
											const value = e.currentTarget.valueAsNumber;
											setIngredientQty(index, Number.isNaN(value) ? 1 : value);
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
							disabled={disableAddButton}
							onClick={addIngredient}
						>
							Add Ingredient
						</Button>
					</div>
				</div>

				<DialogFooter>
					<Button
						type="button"
						variant="outline"
						onClick={() => toggleOpen(false)}
					>
						Cancel
					</Button>
					<Button type="button" onClick={handleSubmit}>
						{submitLabel}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
