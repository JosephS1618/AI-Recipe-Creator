import type { ComponentType } from "react";
import { useNavigate } from "react-router";
import { useAccountSession } from "@/components/account-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function LoginRequiredFallback() {
	const navigate = useNavigate();

	return (
		<div className="max-w-2xl">
			<Card>
				<CardContent className="pt-6">
					<div className="text-center text-muted-foreground">
						Please log in to continue.
					</div>
					<div className="mt-4 flex justify-center">
						<Button onClick={() => navigate("/login")}>Go to Login</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

export function withLoginRequired<P extends object>(
	Component: ComponentType<P>,
) {
	return (props: P) => {
		const { currentUser } = useAccountSession();

		return currentUser ? <Component {...props} /> : <LoginRequiredFallback />;
	};
}
