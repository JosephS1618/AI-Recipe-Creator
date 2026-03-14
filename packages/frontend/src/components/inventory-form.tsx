import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type {
	CreateInventoryInput,
	Inventory,
	UpdateInventoryInput,
} from "@/query";

type InventoryFormMode = "create" | "update";

export interface InventoryFormProps {
	mode: InventoryFormMode;
	initialData?: Inventory;
	onSubmit: (data: CreateInventoryInput | UpdateInventoryInput) => void;
	isSubmitting?: boolean;
}

export function InventoryForm({
	mode,
	initialData,
	onSubmit,
	isSubmitting = false,
}: InventoryFormProps) {
	const [name, setName] = useState(initialData?.name || "");
	const [description, setDescription] = useState(
		initialData?.description || "",
	);
	const [type, setType] = useState(initialData?.type || "");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!name.trim() || !type.trim()) {
			alert("Please fill in required fields (Name and Type)");
			return;
		}

		if (mode === "create") {
			onSubmit({
				name: name.trim(),
				description: description.trim(),
				type: type.trim(),
			} as CreateInventoryInput);
		} else {
			onSubmit({
				id: initialData?.inventoryid || "",
				name: name.trim(),
				description: description.trim(),
				type: type.trim(),
			} as UpdateInventoryInput);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div className="grid gap-2">
				<Label htmlFor="name">Inventory Name *</Label>
				<Input
					id="name"
					placeholder="e.g., Kitchen Pantry"
					value={name}
					onChange={(e) => setName(e.target.value)}
					disabled={isSubmitting}
					maxLength={255}
				/>
			</div>

			<div className="grid gap-2">
				<Label htmlFor="type">Type *</Label>
				<Input
					id="type"
					placeholder="e.g., Pantry, Fridge, Freezer"
					value={type}
					onChange={(e) => setType(e.target.value)}
					disabled={isSubmitting}
					maxLength={255}
				/>
			</div>

			<div className="grid gap-2">
				<Label htmlFor="description">Description</Label>
				<textarea
					id="description"
					placeholder="Optional description of your inventory"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					disabled={isSubmitting}
					maxLength={1000}
					className="min-h-24 rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
				/>
			</div>

			<div className="pt-4 flex gap-2 justify-end">
				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting
						? "Saving..."
						: mode === "create"
							? "Create Inventory"
							: "Update Inventory"}
				</Button>
			</div>
		</form>
	);
}
