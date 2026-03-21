import { createBrowserRouter, Navigate } from "react-router";
import { Layout } from "./components/layout";
import { CommunityPost } from "./pages/community-post";
import { Ingredients } from "./pages/ingredients";
import { Inventories } from "./pages/inventories";
import { InventoryDetail } from "./pages/inventory-detail";
import { Login } from "./pages/login";
import { RecipeDetailPage } from "./pages/recipe-detail";
import { RecipeNotes } from "./pages/recipe-notes";
import { Recipes } from "./pages/recipes";
import SettingsPage from "./pages/settings";

function IndexRedirect() {
	return <Navigate to="/login" replace />;
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
				path: "ingredients",
				Component: Ingredients,
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
				path: "inventories/:inventoryId",
				Component: InventoryDetail,
			},
			{
				path: "recipes",
				Component: Recipes,
			},
			{
				path: "recipes/:recipeId",
				Component: RecipeDetailPage,
			},
			{
				path: "community-post",
				Component: CommunityPost,
			},
			{
				path: "recipe-notes",
				Component: RecipeNotes,
			},
			{
				path: "settings",
				Component: SettingsPage,
			},
		],
	},
]);
