import {
	MutationCache,
	QueryCache,
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { toast } from "sonner";
import { AccountProvider } from "@/components/account-provider";
import { Toaster } from "@/components/ui/sonner";

import "./index.css";
import { router } from "./router";

const queryClient = new QueryClient({
	queryCache: new QueryCache({
		onError: (error) => {
			toast.error(`Query error: ${error.message}`, { duration: 10000 });
		},
	}),
	mutationCache: new MutationCache({
		onError: (error) => {
			toast.error(`Mutation error: ${error.message}`, { duration: 10000 });
		},
	}),
});

const elm = document.getElementById("root");

if (elm) {
	createRoot(elm).render(
		<StrictMode>
			<QueryClientProvider client={queryClient}>
				<AccountProvider>
					<RouterProvider router={router} />
				</AccountProvider>
				<Toaster position="top-center" />
			</QueryClientProvider>
		</StrictMode>,
	);
}
