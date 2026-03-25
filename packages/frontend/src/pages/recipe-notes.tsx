import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";

import {
	RecipeNoteForm,
	type RecipeNoteFormValue,
} from "@/components/recipe-note-form";
import { Card, CardContent } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { useCreateRecipeNote, useGetRecipeNotes } from "@/query";

export function RecipeNotes() {
	const [formValue, setFormValue] = useState<RecipeNoteFormValue>({
		note: "",
		photo: null,
		recipe_ids: [],
	});

	const recipeNotesResult = useGetRecipeNotes();
	const createRecipeNote = useCreateRecipeNote();
	const recipeNotes = recipeNotesResult.data ?? [];

	const handleSubmit = (value: RecipeNoteFormValue) => {
		createRecipeNote.mutate(
			{
				note: value.note,
				photo: value.photo,
				recipe_ids: value.recipe_ids,
			},
			{
				onSuccess: () => {
					setFormValue({
						note: "",
						photo: null,
						recipe_ids: [],
					});
					toast.success("Recipe note created.");
				},
			},
		);
	};

	return (
		<div className="space-y-6 px-4">
			<h1 className="text-3xl font-bold">Recipe Notes</h1>

			<section className="space-y-4">
				{recipeNotesResult.isLoading ? (
					<p className="text-sm text-muted-foreground">
						Loading recipe notes...
					</p>
				) : recipeNotes.length === 0 ? (
					<p className="text-sm text-muted-foreground">No recipe notes yet.</p>
				) : (
					<Card>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Note</TableHead>
										<TableHead>Photo</TableHead>
										<TableHead>Created</TableHead>
										<TableHead>Updated</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{recipeNotes.map((recipeNote) => (
										<TableRow key={recipeNote.recipe_note_id}>
											<TableCell className="max-w-md truncate font-medium">
												<Link
													to={`/recipe-notes/${recipeNote.recipe_note_id}`}
													className="hover:underline"
												>
													{recipeNote.note}
												</Link>
											</TableCell>
											<TableCell>{recipeNote.photo ? "Yes" : "No"}</TableCell>
											<TableCell>
												{formatDate(recipeNote.creation_date)}
											</TableCell>
											<TableCell>
												{formatDate(recipeNote.modification_date)}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				)}
			</section>

			<RecipeNoteForm
				title="Create Note"
				submitLabel="Create Note"
				value={formValue}
				onChange={setFormValue}
				onSubmit={handleSubmit}
				isSubmitting={createRecipeNote.isPending}
			/>
		</div>
	);
}
