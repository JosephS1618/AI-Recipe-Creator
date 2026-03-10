import { createBrowserRouter, Navigate } from "react-router";
import { Layout } from "./components/layout";
import { CommunityPost } from "./pages/community-post";
import { Demo } from "./pages/demo";
import { Inventories } from "./pages/inventories";
import { Login } from "./pages/login";
import { RecipeNotes } from "./pages/recipe-notes";
import { Recipes } from "./pages/recipes";

function IndexRedirect() {
	return <Navigate to="/demo" replace />;
}

export const router = createBrowserRouter([
	{
		path: "/",
		Component: Layout,
		children: [
			{
				index: true,
				Component: IndexRedirect,
			},
			{
				path: "demo",
				Component: Demo,
			},
			{
				path: "login",
				Component: Login,
			},
			{
				path: "inventories",
				Component: Inventories,
			},
			{
				path: "recipes",
				Component: Recipes,
			},
			{
				path: "community-post",
				Component: CommunityPost,
			},
			{
				path: "recipe-notes",
				Component: RecipeNotes,
			},
		],
	},
]);
