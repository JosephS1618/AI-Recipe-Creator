import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { InventoryDialog } from "@/components/inventory-dialog";
import { ShareDialog } from "@/components/share-dialog";
import { SharedUsersList } from "@/components/shared-users-list";
import { Button } from "@/components/ui/button";
import type { Inventory, UpdateInventoryInput } from "@/query";
import {
	useDeleteInventory,
	useGetCoOwners,
	useUnshareInventory,
	useUpdateInventory,
} from "@/query";

export interface InventoryItemProps {
	inventory: Inventory;
	currentAccountId: string;
}

export function InventoryItem({
	inventory,
	currentAccountId,
}: InventoryItemProps) {
	const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const updateMutation = useUpdateInventory();
	const deleteMutation = useDeleteInventory();
	const unshareMutation = useUnshareInventory();
	const { data: coOwners = [] } = useGetCoOwners(inventory.inventoryid);

	const handleDeleteClick = () => {
		deleteMutation.mutate(
			{ id: inventory.inventoryid },
			{
				onSuccess: () => {
					toast.success("Inventory deleted successfully");
				},
			},
		);
	};

	const handleUnshare = (accountId: string) => {
		unshareMutation.mutate(
			{
				inventoryId: inventory.inventoryid,
				data: { accountId },
			},
			{
				onSuccess: () => {
					toast.success("Co-owner removed successfully");
				},
			},
		);
	};

	return (
		<div className="border rounded-lg p-4">
			<div className="flex items-center justify-between mb-2">
				<div className="flex-1 min-w-0">
					<Link
						to={`/inventories/${inventory.inventoryid}`}
						className="text-lg font-semibold hover:underline"
					>
						{inventory.name}
					</Link>
					<p className="text-sm text-muted-foreground">
						Type: {inventory.type}
					</p>
					{inventory.description && (
						<p className="text-sm text-muted-foreground mt-1">
							Description: {inventory.description}
						</p>
					)}
				</div>
				<div className="flex gap-2 ml-4">
					<Button
						variant="outline"
						size="sm"
						onClick={() => setIsShareDialogOpen(true)}
					>
						Share
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => setIsEditDialogOpen(true)}
					>
						Edit
					</Button>
					<Button
						variant="outline"
						size="sm"
						className="text-destructive hover:text-destructive"
						onClick={handleDeleteClick}
					>
						Delete
					</Button>
				</div>
			</div>

			{coOwners.length > 1 && (
				<SharedUsersList
					coOwners={coOwners}
					currentAccountId={currentAccountId}
					onUnshare={handleUnshare}
					isLoading={unshareMutation.isPending}
				/>
			)}

			<ShareDialog
				inventoryId={inventory.inventoryid}
				isOpen={isShareDialogOpen}
				onOpenChange={setIsShareDialogOpen}
			/>

			<InventoryDialog
				mode="update"
				isOpen={isEditDialogOpen}
				onOpenChange={setIsEditDialogOpen}
				selectedInventory={inventory}
				onSubmit={(data) => {
					updateMutation.mutate(data as UpdateInventoryInput, {
						onSuccess: () => {
							toast.success("Inventory updated successfully");
							setIsEditDialogOpen(false);
						},
					});
				}}
				isSubmitting={updateMutation.isPending}
			/>
		</div>
	);
}
