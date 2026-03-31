import { InventoryForm } from "@/components/inventory-form";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type {
	CreateInventoryInput,
	Inventory,
	UpdateInventoryInput,
} from "@/query";

type InventoryDialogMode = "create" | "update";

export interface InventoryDialogProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	mode: InventoryDialogMode;
	selectedInventory?: Inventory;
	onSubmit: (data: CreateInventoryInput | UpdateInventoryInput) => void;
	isSubmitting?: boolean;
}

export function InventoryDialog({
	isOpen,
	onOpenChange,
	mode,
	selectedInventory,
	onSubmit,
	isSubmitting = false,
}: InventoryDialogProps) {
	const handleFormSubmit = (
		data: CreateInventoryInput | UpdateInventoryInput,
	) => {
		onSubmit(data);
	};

	const isCreateMode = mode === "create";
	const title = isCreateMode ? "Create New Inventory" : "Update Inventory";
	const description = isCreateMode
		? "Add a new inventory to get started."
		: "Update your inventory details.";

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>

				<InventoryForm
					key={`${mode}-${selectedInventory?.inventoryid}-${isOpen}`}
					mode={mode}
					initialData={selectedInventory}
					onSubmit={handleFormSubmit}
					isSubmitting={isSubmitting}
				/>
			</DialogContent>
		</Dialog>
	);
}
