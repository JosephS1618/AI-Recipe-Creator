import { createBrowserRouter } from "react-router";

import { Demo } from "./pages/demo";

export const router = createBrowserRouter([
	{
		path: "/",
		Component: Demo,
	},
]);
