import { createBrowserRouter, Navigate } from "react-router";
import { Layout } from "./components/layout";
import { withLoginRequired } from "./components/require-login";
import { CommunityPost } from "./pages/community-post";
import { Ingredients } from "./pages/ingredients";
import { Inventories } from "./pages/inventories";
import { InventoryDetail } from "./pages/inventory-detail";
import { Login } from "./pages/login";
import { RecipeDetailPage } from "./pages/recipe-detail";
import { RecipeNoteDetail } from "./pages/recipe-note-detail";
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
				Component: withLoginRequired(Ingredients),
			},
			{
				path: "login",
				Component: Login,
			},
			{
				path: "inventories",
				Component: withLoginRequired(Inventories),
			},
			{
				path: "inventories/:inventoryId",
				Component: withLoginRequired(InventoryDetail),
			},
			{
				path: "recipes",
				Component: withLoginRequired(Recipes),
			},
			{
				path: "recipes/:recipeId",
				Component: withLoginRequired(RecipeDetailPage),
			},
			{
				path: "community-post",
				Component: withLoginRequired(CommunityPost),
			},
			{
				path: "recipe-notes",
				Component: withLoginRequired(RecipeNotes),
			},
			{
				path: "recipe-notes/:recipeNoteId",
				Component: withLoginRequired(RecipeNoteDetail),
			},
			{
				path: "settings",
				Component: withLoginRequired(SettingsPage),
			},
		],
	},
]);
