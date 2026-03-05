import { useState } from "react";

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

	const [carbs, setCarbs] = useState(ingredient.carbs);
	const [protein, setProtein] = useState(ingredient.protein);
	const [fat, setFat] = useState(ingredient.fat);

	return (
		<div>
			<form action="">
				<label htmlFor="name">Name</label>
				<input
					type="text"
					id="name"
					name="name"
					value={ingredient.name}
					disabled
				/>
				<label htmlFor="carbs">Carbs</label>
				<input
					type="number"
					id="carbs"
					name="carbs"
					value={carbs}
					onChange={(e) => setCarbs(Number(e.target.value))}
				/>
				<label htmlFor="protein">Protein</label>
				<input
					type="number"
					id="protein"
					name="protein"
					value={protein}
					onChange={(e) => setProtein(Number(e.target.value))}
				/>
				<label htmlFor="fat">Fat</label>
				<input
					type="number"
					id="fat"
					name="fat"
					value={fat}
					onChange={(e) => setFat(Number(e.target.value))}
				/>
				<button
					type="button"
					onClick={() => removeIngredient.mutate({ name: ingredient.name })}
				>
					Remove Ingredient
				</button>
				<button
					type="button"
					onClick={() =>
						editIngredient.mutate({
							name: ingredient.name,
							carbs,
							protein,
							fat,
						})
					}
				>
					Edit Ingredient
				</button>
			</form>
		</div>
	);
}

function IngredientsList() {
	const { data: ingredients = [] } = useFetchIngredients();

	return (
		<div>
			<h1>Ingredients</h1>
			{ingredients.length === 0 && <p>No ingredients found</p>}
			{ingredients.map((ingredient) => (
				<IngredientListItem key={ingredient.name} ingredient={ingredient} />
			))}
		</div>
	);
}

function AddIngredient() {
	const addIngredient = useAddIngredient();
	const [name, setName] = useState("");
	const [carbs, setCarbs] = useState(0);
	const [protein, setProtein] = useState(0);
	const [fat, setFat] = useState(0);

	return (
		<div>
			<form>
				<label htmlFor="name">Name</label>
				<input
					type="text"
					id="name"
					name="name"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
				<label htmlFor="carbs">Carbs</label>
				<input
					type="number"
					id="carbs"
					name="carbs"
					value={carbs}
					onChange={(e) => setCarbs(Number(e.target.value))}
				/>
				<label htmlFor="protein">Protein</label>
				<input
					type="number"
					id="protein"
					name="protein"
					value={protein}
					onChange={(e) => setProtein(Number(e.target.value))}
				/>
				<label htmlFor="fat">Fat</label>
				<input
					type="number"
					id="fat"
					name="fat"
					value={fat}
					onChange={(e) => setFat(Number(e.target.value))}
				/>
				<button
					type="button"
					onClick={() => addIngredient.mutate({ name, carbs, protein, fat })}
				>
					Add Ingredient
				</button>
			</form>
		</div>
	);
}

function App() {
	return (
		<div>
			<IngredientsList />
			<AddIngredient />
		</div>
	);
}

export default App;
