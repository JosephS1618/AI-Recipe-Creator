import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { InventoryDialog } from "@/components/inventory-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	type Inventory,
	useCreateInventory,
	useDeleteInventory,
	useFetchInventories,
	useUpdateInventory,
} from "@/query";

type DialogMode = "create" | "update";

export function Inventories() {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogMode, setDialogMode] = useState<DialogMode>("create");
	const [selectedInventory, setSelectedInventory] = useState<Inventory>();

	// Queries and mutations
	const { data: inventories = [], isLoading } = useFetchInventories();
	const createMutation = useCreateInventory();
	const updateMutation = useUpdateInventory();
	const deleteMutation = useDeleteInventory();

	const handleCreateClick = () => {
		setDialogMode("create");
		setSelectedInventory(undefined);
		setDialogOpen(true);
	};

	const handleEditClick = (inventory: Inventory) => {
		setDialogMode("update");
		setSelectedInventory(inventory);
		setDialogOpen(true);
	};

	const handleDeleteClick = (inventory: Inventory) => {
		if (
			window.confirm(`Are you sure you want to delete "${inventory.name}"?`)
		) {
			deleteMutation.mutate(
				{ id: inventory.inventoryid },
				{
					onSuccess: () => {
						toast.success("Inventory deleted successfully");
					},
					onError: (error) => {
						toast.error(error.message || "Failed to delete inventory");
					},
				},
			);
		}
	};

	const handleDialogSubmit = (data: any) => {
		if (dialogMode === "create") {
			createMutation.mutate(data, {
				onSuccess: () => {
					toast.success("Inventory created successfully");
					setDialogOpen(false);
				},
				onError: (error) => {
					toast.error(error.message || "Failed to create inventory");
				},
			});
		} else {
			updateMutation.mutate(data, {
				onSuccess: () => {
					toast.success("Inventory updated successfully");
					setDialogOpen(false);
				},
				onError: (error) => {
					toast.error(error.message || "Failed to update inventory");
				},
			});
		}
	};

	const isSubmitting = createMutation.isPending || updateMutation.isPending;

	return (
		<div className="max-w-6xl space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Inventories</h1>
					<p className="text-muted-foreground mt-1">
						Manage your food inventories and storage locations
					</p>
				</div>
				<Button onClick={handleCreateClick} disabled={isLoading}>
					Create Inventory
				</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Your Inventories</CardTitle>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<div className="text-center py-8 text-muted-foreground">
							Loading inventories...
						</div>
					) : inventories.length === 0 ? (
						<div className="text-center py-8">
							<p className="text-muted-foreground mb-4">
								No inventories yet. Create one to get started!
							</p>
							<Button onClick={handleCreateClick}>
								Create Your First Inventory
							</Button>
						</div>
					) : (
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Name</TableHead>
										<TableHead>Type</TableHead>
										<TableHead>Description</TableHead>
										<TableHead className="text-right">Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{inventories.map((inventory) => (
										<TableRow key={inventory.inventoryid}>
											<TableCell className="font-medium">
												<Link to={`/inventories/${inventory.inventoryid}`}>
													{inventory.name}
												</Link>
											</TableCell>
											<TableCell>{inventory.type}</TableCell>
											<TableCell className="text-muted-foreground max-w-xs truncate">
												{inventory.description || "—"}
											</TableCell>
											<TableCell className="text-right">
												<div className="flex gap-2 justify-end">
													<Button
														variant="outline"
														size="sm"
														onClick={() => handleEditClick(inventory)}
														disabled={isSubmitting || deleteMutation.isPending}
													>
														Edit
													</Button>
													<Button
														variant="outline"
														size="sm"
														className="text-destructive hover:text-destructive"
														onClick={() => handleDeleteClick(inventory)}
														disabled={isSubmitting || deleteMutation.isPending}
													>
														{deleteMutation.isPending
															? "Deleting..."
															: "Delete"}
													</Button>
												</div>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					)}
				</CardContent>
			</Card>

			<InventoryDialog
				isOpen={dialogOpen}
				onOpenChange={setDialogOpen}
				mode={dialogMode}
				selectedInventory={selectedInventory}
				onSubmit={handleDialogSubmit}
				isSubmitting={isSubmitting}
			/>
		</div>
	);
}
