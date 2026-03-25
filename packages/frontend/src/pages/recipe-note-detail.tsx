import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "sonner";

import {
	RecipeNoteForm,
	type RecipeNoteFormValue,
} from "@/components/recipe-note-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import {
	useDeleteRecipeNote,
	useGetRecipeNote,
	useUpdateRecipeNote,
} from "@/query";

const emptyFormValue: RecipeNoteFormValue = {
	note: "",
	photo: null,
	recipe_ids: [],
};

export function RecipeNoteDetail() {
	const { recipeNoteId = "" } = useParams();
	const navigate = useNavigate();

	const [formValue, setFormValue] =
		useState<RecipeNoteFormValue>(emptyFormValue);

	const recipeNoteResult = useGetRecipeNote(recipeNoteId);
	const updateRecipeNote = useUpdateRecipeNote();
	const deleteRecipeNote = useDeleteRecipeNote();
	const recipeNote = recipeNoteResult.data;

	useEffect(() => {
		if (recipeNote) {
			setFormValue({
				note: recipeNote.note,
				photo: recipeNote.photo,
				recipe_ids: recipeNote.recipes.map((recipe) => recipe.recipe_id),
			});
		}
	}, [recipeNote]);

	const handleUpdate = (value: RecipeNoteFormValue) => {
		updateRecipeNote.mutate(
			{
				recipe_note_id: recipeNoteId,
				note: value.note,
				photo: value.photo,
				recipe_ids: value.recipe_ids,
			},
			{
				onSuccess: () => {
					toast.success("Recipe note updated.");
				},
			},
		);
	};

	const handleDelete = () => {
		deleteRecipeNote.mutate(recipeNoteId, {
			onSuccess: () => {
				toast.success("Recipe note deleted.");
				navigate("/recipe-notes");
			},
		});
	};

	return (
		<div className="space-y-6 px-4">
			<div className="flex items-center justify-between gap-3">
				<div>
					<h1 className="text-3xl font-bold">Recipe Note Detail</h1>
					<p className="text-sm text-muted-foreground">
						Recipe Note ID: {recipeNoteId}
					</p>
				</div>

				<div className="flex flex-wrap gap-2">
					<Button asChild variant="outline">
						<Link to="/recipe-notes">Back</Link>
					</Button>
					<Button
						variant="destructive"
						onClick={handleDelete}
						disabled={
							deleteRecipeNote.isPending ||
							updateRecipeNote.isPending ||
							!recipeNote
						}
					>
						{deleteRecipeNote.isPending ? "Deleting..." : "Delete"}
					</Button>
				</div>
			</div>

			{recipeNoteResult.isLoading && (
				<p className="text-sm text-muted-foreground">Loading recipe note...</p>
			)}

			{recipeNote && (
				<>
					<Card>
						<CardContent className="grid gap-4 text-sm md:grid-cols-2">
							<div>
								<div className="text-muted-foreground">Created</div>
								<div>{formatDate(recipeNote.creation_date)}</div>
							</div>
							<div>
								<div className="text-muted-foreground">Updated</div>
								<div>{formatDate(recipeNote.modification_date)}</div>
							</div>
						</CardContent>
					</Card>

					<RecipeNoteForm
						title="Update Note"
						submitLabel="Update Note"
						value={formValue}
						onChange={setFormValue}
						onSubmit={handleUpdate}
						isSubmitting={updateRecipeNote.isPending}
					/>
				</>
			)}
		</div>
	);
}
