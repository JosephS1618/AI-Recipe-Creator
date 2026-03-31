import { useState } from "react";
import { toast } from "sonner";
import { useAccountSession } from "@/components/account-provider";
import { InventoryDialog } from "@/components/inventory-dialog";
import { InventoryItem } from "@/components/inventory-item";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateInventory, useFetchInventories } from "@/query";

export function Inventories() {
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
	const { currentUser } = useAccountSession();
	const { data: inventories = [], isLoading } = useFetchInventories();
	const createMutation = useCreateInventory();

	return (
		<div className="max-w-6xl space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Inventories</h1>
					<p className="text-muted-foreground mt-1">
						Manage your food inventories and storage locations
					</p>
				</div>
				<Button
					disabled={isLoading || createMutation.isPending}
					onClick={() => setIsCreateDialogOpen(true)}
				>
					Create Inventory
				</Button>
				<InventoryDialog
					isOpen={isCreateDialogOpen}
					onOpenChange={setIsCreateDialogOpen}
					mode="create"
					onSubmit={(data) => {
						createMutation.mutate(data, {
							onSuccess: () => {
								toast.success("Inventory created successfully");
								setIsCreateDialogOpen(false);
							},
						});
					}}
					isSubmitting={createMutation.isPending}
				/>
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
						</div>
					) : (
						<div className="space-y-4">
							{inventories.map((inventory) => (
								<InventoryItem
									key={inventory.inventoryid}
									inventory={inventory}
									currentAccountId={currentUser?.accountId || ""}
								/>
							))}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
