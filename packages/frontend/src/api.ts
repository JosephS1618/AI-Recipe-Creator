const BASE_URL = "/api";

export type IngredientItem = {
	name: string;
	carbs: number;
	protein: number;
	fat: number;
};

async function request(path: string, init?: RequestInit): Promise<void> {
	const res = await fetch(`${BASE_URL}${path}`, {
		...init,
		headers: {
			"Content-Type": "application/json",
			...(init?.headers ?? {}),
		},
	});

	if (!res.ok) {
		throw new Error(await res.text());
	}
}

export function getIngredients(): Promise<IngredientItem[]> {
	return fetch(`${BASE_URL}/ingredients`).then((res) => res.json());
}

export function addIngredient(item: IngredientItem): Promise<void> {
	return request(`/ingredients/add`, {
		method: "POST",
		body: JSON.stringify(item),
	});
}

export function editIngredient(item: IngredientItem): Promise<void> {
	return request(`/ingredients/edit`, {
		method: "POST",
		body: JSON.stringify(item),
	});
}

export function removeIngredient(
	item: Pick<IngredientItem, "name">,
): Promise<void> {
	return request(`/ingredients/remove`, {
		method: "POST",
		body: JSON.stringify(item),
	});
}
