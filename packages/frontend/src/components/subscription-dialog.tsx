import { useState } from "react";
import { useAccountSession } from "@/components/account-provider";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import type { Subscription, SubscriptionType } from "@/query";
import { useSubscribe } from "@/query";

export function SubscriptionDialog({
	subscriptions,
	isOpen,
	onOpenChange,
	onSuccess,
}: {
	subscriptions: Subscription[];
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	onSuccess?: () => void;
}) {
	const { saveCurrentUser } = useAccountSession();
	const subscribeMutation = useSubscribe();
	const [selectedType, setSelectedType] = useState<SubscriptionType | null>(
		null,
	);

	function handleConfirm() {
		if (!selectedType) return;

		subscribeMutation.mutate(
			{ subscriptionType: selectedType },
			{
				onSuccess: (user) => {
					saveCurrentUser(user);
					onSuccess?.();
				},
			},
		);
	}

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Upgrade to Paid Account</DialogTitle>
					<DialogDescription>
						Select a subscription plan and confirm to upgrade your account.
					</DialogDescription>
				</DialogHeader>

				<div className="grid gap-4 py-4">
					<div className="text-sm font-medium">Select Plan</div>

					{subscriptions.length === 0 ? (
						<div className="text-sm text-muted-foreground">
							No subscription plans available.
						</div>
					) : (
						<div className="grid gap-3">
							{subscriptions.map((subscription) => (
								<div
									key={subscription.subscriptionType}
									className="flex items-center gap-3"
								>
									<input
										type="radio"
										id={`plan-${subscription.subscriptionType}`}
										name="subscription-plan"
										value={subscription.subscriptionType}
										checked={selectedType === subscription.subscriptionType}
										onChange={() =>
											setSelectedType(subscription.subscriptionType)
										}
										className="h-4 w-4"
									/>
									<Label
										htmlFor={`plan-${subscription.subscriptionType}`}
										className="flex-1 cursor-pointer"
									>
										<div className="flex items-center justify-between gap-1">
											<div className="capitalize font-medium">
												{subscription.subscriptionType === "monthly"
													? "Monthly"
													: "Yearly"}
											</div>
											<div className="font-semibold">
												$
												{(subscription.subscriptionPriceInCents / 100).toFixed(
													2,
												)}
												{subscription.subscriptionType === "monthly"
													? "/mo"
													: "/yr"}
											</div>
										</div>
									</Label>
								</div>
							))}
						</div>
					)}
				</div>

				<div className="flex gap-2 justify-end">
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={subscribeMutation.isPending}
					>
						Cancel
					</Button>
					<Button
						onClick={handleConfirm}
						disabled={!selectedType || subscribeMutation.isPending}
					>
						{subscribeMutation.isPending ? "Confirming..." : "Confirm"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
