import { useState } from "react";
import { useAccountSession } from "@/components/account-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSubscriptions } from "@/query";
import { SubscriptionDialog } from "./subscription-dialog";

export function SubscriptionCard({
	onSubscriptionSuccess,
}: {
	onSubscriptionSuccess: () => void;
}) {
	const { currentUser } = useAccountSession();
	const { data: subscriptions, isLoading } = useSubscriptions();
	const [dialogOpen, setDialogOpen] = useState(false);

	if (!currentUser) {
		return null;
	}

	const isPaid = currentUser.accountType === "paid";

	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Subscription</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-muted-foreground">Loading...</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Subscription</CardTitle>
			</CardHeader>
			<CardContent className="grid gap-4">
				<div className="grid gap-2">
					<div className="text-sm font-medium">Account Type</div>
					<div className="text-sm text-muted-foreground">
						{isPaid ? "Paid Account" : "Trial Account"}
					</div>
				</div>

				{isPaid ? (
					<div className="grid gap-2">
						<div className="text-sm font-medium">Status</div>
						<div className="text-sm text-green-600 dark:text-green-400">
							Active
						</div>
					</div>
				) : (
					<>
						<div className="text-sm text-muted-foreground">
							Upgrade to a paid account to unlock unlimited access.
						</div>
						<SubscriptionDialog
							subscriptions={subscriptions || []}
							isOpen={dialogOpen}
							onOpenChange={setDialogOpen}
							onSuccess={() => {
								setDialogOpen(false);
								onSubscriptionSuccess();
							}}
						/>
						<Button onClick={() => setDialogOpen(true)} className="w-full">
							Upgrade to Paid
						</Button>
					</>
				)}
			</CardContent>
		</Card>
	);
}
