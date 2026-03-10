import type { LucideIcon } from "lucide-react";
import {
	ChefHat,
	FileText,
	LayoutDashboard,
	LogIn,
	MessageSquare,
	Package2,
} from "lucide-react";
import { NavLink, Outlet } from "react-router";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type NavigationItem = {
	title: string;
	description: string;
	icon: LucideIcon;
	to: string;
};

export const navigationItems: NavigationItem[] = [
	{
		title: "Demo",
		description: "Overview of the frontend shell.",
		icon: LayoutDashboard,
		to: "/demo",
	},
	{
		title: "Login",
		description: "Authentication entry point.",
		icon: LogIn,
		to: "/login",
	},
	{
		title: "Inventories",
		description: "Inventory management workspace.",
		icon: Package2,
		to: "/inventories",
	},
	{
		title: "Recipes",
		description: "Recipe browsing and authoring.",
		icon: ChefHat,
		to: "/recipes",
	},
	{
		title: "Community Post",
		description: "Community discussion feed.",
		icon: MessageSquare,
		to: "/community-post",
	},
	{
		title: "Recipe Notes",
		description: "Saved notes and annotations.",
		icon: FileText,
		to: "/recipe-notes",
	},
];

function NavigationLinks({ compact = false }: { compact?: boolean }) {
	return (
		<nav
			className={cn(
				"flex gap-2",
				compact ? "overflow-x-auto pb-1" : "flex-col",
			)}
		>
			{navigationItems.map((item) => (
				<NavLink
					key={item.to}
					to={item.to}
					className={({ isActive }) =>
						cn(
							buttonVariants({
								variant: isActive ? "secondary" : "ghost",
								size: compact ? "sm" : "default",
							}),
							compact
								? "min-w-fit shrink-0"
								: "h-auto justify-start gap-3 px-3 py-3",
						)
					}
				>
					<item.icon className="size-4" />
					<span>{item.title}</span>
				</NavLink>
			))}
		</nav>
	);
}

export function Layout() {
	return (
		<div className="min-h-screen bg-muted/30 text-foreground">
			<div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-4 p-4 md:flex-row md:p-6">
				<aside className="hidden w-full max-w-72 shrink-0 md:block">
					<Card className="sticky top-6 overflow-hidden py-0">
						<CardContent className="flex flex-col gap-6 p-6">
							<h1 className="text-2xl font-semibold tracking-tight">
								CPSC 304
								<br />
								Group Project
							</h1>

							<NavigationLinks />
						</CardContent>
					</Card>
				</aside>

				<main className="min-w-0 flex-1">
					<Outlet />
				</main>
			</div>
		</div>
	);
}
