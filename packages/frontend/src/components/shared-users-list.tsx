import { Button } from "@/components/ui/button";
import type { CoOwner } from "@/query";

export interface SharedUsersListProps {
	coOwners: CoOwner[];
	currentAccountId: string;
	onUnshare: (accountId: string) => void;
	isLoading?: boolean;
}

export function SharedUsersList({
	coOwners,
	currentAccountId,
	onUnshare,
	isLoading = false,
}: SharedUsersListProps) {
	if (coOwners.length <= 1) {
		return null;
	}

	return (
		<div className="mt-4 space-y-2">
			<h3 className="text-sm font-semibold">Co-owners</h3>
			<div className="border rounded-lg overflow-hidden">
				{coOwners.map((coOwner) => (
					<div
						key={coOwner.accountid}
						className="flex items-center justify-between p-3 border-b last:border-b-0"
					>
						<div className="flex flex-col min-w-0">
							<p className="text-sm font-medium text-gray-900">
								{coOwner.username}
							</p>
							<p className="text-xs text-gray-500 truncate">{coOwner.email}</p>
						</div>
						<div className="flex items-center gap-2 ml-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => onUnshare(coOwner.accountid)}
								disabled={isLoading}
							>
								{coOwner.accountid === currentAccountId ? "Leave" : "Remove"}
							</Button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
