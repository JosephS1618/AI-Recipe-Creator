import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { useAccountSession } from "@/components/account-provider";
import { InventoryDialog } from "@/components/inventory-dialog";
import { ShareDialog } from "@/components/share-dialog";
import { SharedUsersList } from "@/components/shared-users-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	type CreateInventoryInput,
	type Inventory,
	type UpdateInventoryInput,
	useCreateInventory,
	useDeleteInventory,
	useFetchInventories,
	useGetCoOwners,
	useShareInventory,
	useUnshareInventory,
	useUpdateInventory,
} from "@/query";

type DialogMode = "create" | "update";

export function Inventories() {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogMode, setDialogMode] = useState<DialogMode>("create");
	const [selectedInventory, setSelectedInventory] = useState<Inventory>();
	const [shareDialogOpen, setShareDialogOpen] = useState(false);
	const [expandedInventoryId, setExpandedInventoryId] = useState<string | null>(
		null,
	);

	// Queries and mutations
	const { currentUser } = useAccountSession();
	const { data: inventories = [], isLoading } = useFetchInventories();
	const createMutation = useCreateInventory();
	const updateMutation = useUpdateInventory();
	const deleteMutation = useDeleteInventory();
	const shareMutation = useShareInventory();
	const unshareMutation = useUnshareInventory();

	// Get co-owners for expanded inventory
	const { data: coOwners = [] } = useGetCoOwners(expandedInventoryId || "");

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

	const handleShareClick = (inventory: Inventory) => {
		setSelectedInventory(inventory);
		setShareDialogOpen(true);
	};

	const handleShareSubmit = async (emailOrUsername: string) => {
		if (!selectedInventory) return;

		return new Promise<void>((resolve, reject) => {
			shareMutation.mutate(
				{
					inventoryId: selectedInventory.inventoryid,
					data: { emailOrUsername },
				},
				{
					onSuccess: () => {
						toast.success("Inventory shared successfully");
						setShareDialogOpen(false);
						resolve();
					},
					onError: (error) => {
						toast.error(error.message || "Failed to share inventory");
						reject(error);
					},
				},
			);
		});
	};

	const handleUnshare = (accountId: string) => {
		if (!expandedInventoryId) return;
		unshareMutation.mutate(
			{
				inventoryId: expandedInventoryId,
				data: { accountId },
			},
			{
				onSuccess: () => {
					toast.success("Co-owner removed successfully");
				},
				onError: (error) => {
					toast.error(error.message || "Failed to remove co-owner");
				},
			},
		);
	};

	const handleDialogSubmit = (
		data: CreateInventoryInput | UpdateInventoryInput,
	) => {
		if (dialogMode === "create") {
			createMutation.mutate(data as CreateInventoryInput, {
				onSuccess: () => {
					toast.success("Inventory created successfully");
					setDialogOpen(false);
				},
				onError: (error) => {
					toast.error(error.message || "Failed to create inventory");
				},
			});
		} else {
			updateMutation.mutate(data as UpdateInventoryInput, {
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
						<div className="space-y-4">
							{inventories.map((inventory) => (
								<div
									key={inventory.inventoryid}
									className="border rounded-lg p-4"
								>
									<div className="flex items-center justify-between mb-2">
										<div className="flex-1 min-w-0">
											<Link
												to={`/inventories/${inventory.inventoryid}`}
												className="text-lg font-semibold hover:underline"
											>
												{inventory.name}
											</Link>
											<p className="text-sm text-muted-foreground">
												{inventory.type}
											</p>{" "}
											<p className="text-sm text-muted-foreground">
												Owner: {inventory.ownerUsername}
											</p>{" "}
											{inventory.description && (
												<p className="text-sm text-muted-foreground mt-1">
													{inventory.description}
												</p>
											)}
										</div>
										<div className="flex gap-2 ml-4">
											<Button
												variant="outline"
												size="sm"
												onClick={() => handleShareClick(inventory)}
												disabled={isSubmitting || shareMutation.isPending}
											>
												Share
											</Button>
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
												{deleteMutation.isPending ? "Deleting..." : "Delete"}
											</Button>
										</div>
									</div>

									{expandedInventoryId === inventory.inventoryid && (
										<div className="mt-4 pt-4 border-t">
											<SharedUsersList
												coOwners={coOwners}
												currentAccountId={currentUser?.accountId || ""}
												onUnshare={handleUnshare}
												isLoading={unshareMutation.isPending}
											/>
										</div>
									)}

									{coOwners.length > 1 && (
										<button
											type="button"
											onClick={() =>
												setExpandedInventoryId(
													expandedInventoryId === inventory.inventoryid
														? null
														: inventory.inventoryid,
												)
											}
											className="text-sm text-blue-600 hover:underline mt-2"
										>
											{expandedInventoryId === inventory.inventoryid
												? "Hide co-owners"
												: `View ${coOwners.length} co-owners`}
										</button>
									)}
								</div>
							))}
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

			<ShareDialog
				isOpen={shareDialogOpen}
				onOpenChange={setShareDialogOpen}
				onSubmit={handleShareSubmit}
				isSubmitting={shareMutation.isPending}
			/>
		</div>
	);
}
