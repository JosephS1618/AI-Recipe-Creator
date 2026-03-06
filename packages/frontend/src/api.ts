const BASE_URL = "/api";

export type IngredientItem = {
	name: string;
	carbs: number;
	protein: number;
	fat: number;
};

type ApiResponse<T> = {
	ok: boolean;
	msg: string;
	data: T;
};

async function requestData<T>(path: string, init?: RequestInit): Promise<T> {
	const res = await fetch(`${BASE_URL}${path}`, {
		...init,
		headers: {
			"Content-Type": "application/json",
			...(init?.headers ?? {}),
		},
	});

	const body = (await res.json()) as ApiResponse<T>;

	if (!res.ok || !body.ok) {
		throw new Error(body.msg);
	}

	return body.data;
}

async function request(path: string, init?: RequestInit): Promise<void> {
	await requestData<null>(path, init);
}

export function getIngredients(): Promise<IngredientItem[]> {
	return requestData<IngredientItem[]>("/ingredients");
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
