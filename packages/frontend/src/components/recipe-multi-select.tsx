import * as React from "react";
import {
	Combobox,
	ComboboxChip,
	ComboboxChips,
	ComboboxChipsInput,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxItem,
	ComboboxList,
	ComboboxValue,
	useComboboxAnchor,
} from "@/components/ui/combobox";
import { useGetRecipes } from "@/query";

type RecipeMultiSelectProps = {
	value: string[];
	onChange: (value: string[]) => void;
};

type RecipeOption = {
	value: string;
	label: string;
};

export function RecipeMultiSelect({ value, onChange }: RecipeMultiSelectProps) {
	const anchor = useComboboxAnchor();
	const recipesResult = useGetRecipes();
	const recipes = (recipesResult.data ?? []).map(
		(recipe): RecipeOption => ({
			value: recipe.recipe_id,
			label: recipe.name,
		}),
	);

	return (
		<Combobox
			multiple
			autoHighlight
			items={recipes}
			value={recipes.filter((recipe) => value.includes(recipe.value))}
			onValueChange={(items) => onChange(items.map(({ value }) => value))}
		>
			<ComboboxChips ref={anchor}>
				<ComboboxValue>
					{(values: RecipeOption[]) => (
						<React.Fragment>
							{values.map((recipe: RecipeOption) => (
								<ComboboxChip key={recipe.value}>{recipe.label}</ComboboxChip>
							))}
							<ComboboxChipsInput placeholder="Select recipes" />
						</React.Fragment>
					)}
				</ComboboxValue>
			</ComboboxChips>

			<ComboboxContent anchor={anchor}>
				<ComboboxEmpty>No items found.</ComboboxEmpty>
				<ComboboxList>
					{(recipe: RecipeOption) => (
						<ComboboxItem key={recipe.value} value={recipe}>
							{recipe.label}
						</ComboboxItem>
					)}
				</ComboboxList>
			</ComboboxContent>
		</Combobox>
	);
}
