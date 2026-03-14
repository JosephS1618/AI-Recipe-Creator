import { useNavigate } from "react-router";
import { useAccountSession } from "@/components/account-provider";
import { SubscriptionCard } from "@/components/subscription-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRefreshCurrentUser } from "@/query";

export default function SettingsPage() {
	const navigate = useNavigate();
	const { currentUser, saveCurrentUser } = useAccountSession();
	const refreshMutation = useRefreshCurrentUser();

	if (!currentUser) {
		return (
			<div className="max-w-2xl">
				<Card>
					<CardContent className="pt-6">
						<div className="text-center text-muted-foreground">
							Please log in to view account settings.
						</div>
						<div className="mt-4 flex justify-center">
							<Button onClick={() => navigate("/login")}>Go to Login</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	const handleRefreshUser = () => {
		refreshMutation.mutate(undefined, {
			onSuccess: saveCurrentUser,
		});
	};

	return (
		<div className="max-w-2xl space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
				<p className="text-muted-foreground mt-1">
					Manage your account information and subscription
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Account Information</CardTitle>
				</CardHeader>
				<CardContent className="grid gap-4">
					<div className="grid gap-2">
						<div className="text-sm font-medium">Username</div>
						<div className="text-sm text-muted-foreground">
							{currentUser.username}
						</div>
					</div>

					<div className="grid gap-2">
						<div className="text-sm font-medium">Email</div>
						<div className="text-sm text-muted-foreground">
							{currentUser.email}
						</div>
					</div>

					<div className="grid gap-2">
						<div className="text-sm font-medium">Account ID</div>
						<div className="text-sm font-mono text-muted-foreground break-all">
							{currentUser.accountId}
						</div>
					</div>

					<div className="mt-4">
						<Button
							variant="outline"
							onClick={handleRefreshUser}
							disabled={refreshMutation.isPending}
						>
							{refreshMutation.isPending
								? "Refreshing..."
								: "Refresh Account Info"}
						</Button>
					</div>
				</CardContent>
			</Card>

			<SubscriptionCard onSubscriptionSuccess={handleRefreshUser} />
		</div>
	);
}
