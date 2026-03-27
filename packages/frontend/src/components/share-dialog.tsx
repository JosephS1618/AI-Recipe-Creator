import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export interface ShareDialogProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (emailOrUsername: string) => Promise<void>;
	isSubmitting?: boolean;
}

export function ShareDialog({
	isOpen,
	onOpenChange,
	onSubmit,
	isSubmitting = false,
}: ShareDialogProps) {
	const [emailOrUsername, setEmailOrUsername] = useState("");
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		if (!emailOrUsername.trim()) {
			setError("Please enter an email or username");
			return;
		}

		try {
			await onSubmit(emailOrUsername);
			setEmailOrUsername("");
		} catch (err) {
			const message =
				err instanceof Error ? err.message : "Failed to share inventory";
			setError(message);
		}
	};

	const handleOpenChange = (open: boolean) => {
		if (!open) {
			setEmailOrUsername("");
			setError(null);
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

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<label htmlFor="emailOrUsername" className="text-sm font-medium">
							Email or Username
						</label>
						<Input
							id="emailOrUsername"
							placeholder="e.g., john@example.com or johndoe"
							value={emailOrUsername}
							onChange={(e) => setEmailOrUsername(e.target.value)}
							disabled={isSubmitting}
						/>
					</div>

					{error && <p className="text-sm text-red-500">{error}</p>}

					<div className="flex justify-end gap-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => handleOpenChange(false)}
							disabled={isSubmitting}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? "Sharing..." : "Share"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
