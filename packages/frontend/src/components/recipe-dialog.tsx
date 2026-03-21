import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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

type RecipeDialogSubmitData = {
	name: string;
	content: string;
	cuisine: string | null;
	time: number;
	ingredients: RecipeIngredient[];
};

type RecipeDialogProps = {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (data: RecipeDialogSubmitData) => void;
};

type RecipeIngredientRow = RecipeIngredient & {
	id: string;
};

function createIngredientRow(): RecipeIngredientRow {
	return {
		id: crypto.randomUUID(),
		ingredient_name: "",
		quantity: 1,
	};
}

export function RecipeDialog({
	isOpen,
	onOpenChange,
	onSubmit,
}: RecipeDialogProps) {
	const { data: allIngredients = [] } = useFetchIngredients();

	const ingredientOptions = useMemo(
		() =>
			allIngredients
				.map((ingredient) => ingredient.name)
				.filter((name) => name.trim() !== "")
				.sort((a, b) => a.localeCompare(b)),
		[allIngredients],
	);

	const [name, setName] = useState("");
	const [content, setContent] = useState("");
	const [cuisine, setCuisine] = useState("");
	const [time, setTime] = useState(0);
	const [ingredients, setIngredients] = useState<RecipeIngredientRow[]>([
		createIngredientRow(),
	]);
	const [openIngredientId, setOpenIngredientId] = useState<string | null>(null);

	useEffect(() => {
		if (!isOpen) return;

		setName("");
		setContent("");
		setCuisine("");
		setTime(0);
		setIngredients([createIngredientRow()]);
		setOpenIngredientId(null);
	}, [isOpen]);

	const updateIngredientName = (index: number, value: string) => {
		setIngredients((prev) =>
			prev.map((ingredient, i) =>
				i === index ? { ...ingredient, ingredient_name: value } : ingredient,
			),
		);
	};

	const updateIngredientQuantity = (index: number, value: number) => {
		setIngredients((prev) =>
			prev.map((ingredient, i) =>
				i === index ? { ...ingredient, quantity: value } : ingredient,
			),
		);
	};

	const addIngredient = () => {
		setIngredients((prev) => [...prev, createIngredientRow()]);
	};

	const removeIngredient = (index: number) => {
		setIngredients((prev) => {
			if (prev.length === 1) return prev;

			const rowToRemove = prev[index];
			if (rowToRemove && openIngredientId === rowToRemove.id) {
				setOpenIngredientId(null);
			}

			return prev.filter((_, i) => i !== index);
		});
	};

	const isAddDisabled = ingredients.some(
		(ingredient) =>
			ingredient.ingredient_name.trim() === "" || ingredient.quantity === 0,
	);

	const handleSubmit = () => {
		if (!name.trim()) return;

		onSubmit({
			name: name.trim(),
			content: content.trim(),
			cuisine: cuisine.trim() || null,
			time: Number.isFinite(time) ? Math.max(0, Math.floor(time)) : 0,
			ingredients: ingredients.map(({ id, ...ingredient }) => ingredient),
		});
	};

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Create Recipe</DialogTitle>
					<DialogDescription>
						Only ingredients already added to the ingredients table can be used
						in recipes
					</DialogDescription>
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
								onChange={(e) =>
									setTime(
										Number.isNaN(e.currentTarget.valueAsNumber)
											? 0
											: e.currentTarget.valueAsNumber,
									)
								}
								placeholder="Minutes"
							/>
						</div>
					</div>

					<div className="grid gap-3">
						<div className="font-medium">Ingredients</div>

						{ingredients.map((ingredient, index) => {
							const isValidChoice =
								ingredient.ingredient_name.trim() === "" ||
								ingredientOptions.includes(ingredient.ingredient_name);

							return (
								<div
									key={ingredient.id}
									className="grid gap-3 md:grid-cols-[1fr_120px_auto]"
								>
									<div className="grid gap-1">
										<Popover
											open={openIngredientId === ingredient.id}
											onOpenChange={(open) =>
												setOpenIngredientId(open ? ingredient.id : null)
											}
										>
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
														<CommandEmpty>No ingredient found.</CommandEmpty>
														<CommandGroup>
															{ingredientOptions.map((optionName) => (
																<CommandItem
																	key={optionName}
																	value={optionName}
																	onSelect={() => {
																		updateIngredientName(index, optionName);
																		setOpenIngredientId(null);
																	}}
																>
																	<Check
																		className={cn(
																			"mr-2 h-4 w-4",
																			ingredient.ingredient_name === optionName
																				? "opacity-100"
																				: "opacity-0",
																		)}
																	/>
																	{optionName}
																</CommandItem>
															))}
														</CommandGroup>
													</CommandList>
												</Command>
											</PopoverContent>
										</Popover>

										{!isValidChoice && (
											<p className="text-sm text-destructive">
												Choose an ingredient from the ingredients table
											</p>
										)}
									</div>

									<Input
										type="number"
										min={1}
										value={ingredient.quantity}
										onChange={(e) =>
											updateIngredientQuantity(
												index,
												Number.isNaN(e.currentTarget.valueAsNumber)
													? 1
													: e.currentTarget.valueAsNumber,
											)
										}
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
							disabled={isAddDisabled}
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
						onClick={() => onOpenChange(false)}
					>
						Cancel
					</Button>
					<Button type="button" onClick={handleSubmit}>
						Create Recipe
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
