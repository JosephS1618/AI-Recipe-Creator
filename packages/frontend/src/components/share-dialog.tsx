import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useShareInventory } from "@/query";

export interface ShareDialogProps {
	inventoryId: string;
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
}

export function ShareDialog({
	inventoryId,
	isOpen,
	onOpenChange,
}: ShareDialogProps) {
	const [emailOrUsername, setEmailOrUsername] = useState("");
	const shareMutation = useShareInventory();

	const handleOpenChange = (open: boolean) => {
		if (!open) {
			setEmailOrUsername("");
		}
		onOpenChange(open);
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Share Inventory</DialogTitle>
					<DialogDescription>
						Share this inventory with another user by entering their email or
						username.
					</DialogDescription>
				</DialogHeader>

				<form className="space-y-4">
					<div className="space-y-2">
						<label htmlFor="emailOrUsername" className="text-sm font-medium">
							Email or Username
						</label>
						<Input
							id="emailOrUsername"
							placeholder="e.g., user2@email.com or Ali"
							value={emailOrUsername}
							onChange={(e) => setEmailOrUsername(e.target.value)}
							disabled={shareMutation.isPending}
						/>
					</div>

					<div className="flex justify-end gap-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => handleOpenChange(false)}
							disabled={shareMutation.isPending}
						>
							Cancel
						</Button>
						<Button
							type="button"
							disabled={shareMutation.isPending || !emailOrUsername.trim()}
							onClick={() => {
								shareMutation.mutate(
									{
										inventoryId,
										data: { emailOrUsername: emailOrUsername.trim() },
									},
									{
										onSuccess: () => {
											toast.success("Inventory shared successfully");
											setEmailOrUsername("");
											onOpenChange(false);
										},
									},
								);
							}}
						>
							Share
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
