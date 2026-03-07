import {
	MutationCache,
	QueryCache,
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { toast } from "sonner";

import "./index.css";
import App from "./App.tsx";

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
				<App />
			</QueryClientProvider>
		</StrictMode>,
	);
}
