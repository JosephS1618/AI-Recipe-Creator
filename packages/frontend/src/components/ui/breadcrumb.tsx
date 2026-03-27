import { Link } from "react-router";

type BreadcrumbItem = {
	label: string;
	href?: string;
};

interface BreadcrumbProps {
	items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
	return (
		<nav aria-label="Breadcrumb" className="mb-6">
			<ol className="flex items-center space-x-2 text-sm text-muted-foreground">
				{items.map((item, index) => (
					<li key={index} className="flex items-center">
						{item.href ? (
							<>
								<Link
									to={item.href}
									className="hover:text-foreground transition-colors"
								>
									{item.label}
								</Link>
								{index < items.length - 1 && <span className="mx-2">/</span>}
							</>
						) : (
							<>
								<span className="text-foreground font-medium">
									{item.label}
								</span>
								{index < items.length - 1 && <span className="mx-2">/</span>}
							</>
						)}
					</li>
				))}
			</ol>
		</nav>
	);
}
