import { useState } from "react";
import { toast } from "sonner";

import { RecipeMultiSelect } from "@/components/recipe-multi-select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { UploadButton } from "@/components/upload-button";
import { formatDate, getPhotoUrl } from "@/lib/utils";
import { useCreateRecipeNote, useGetRecipeNotes } from "@/query";

export function RecipeNotes() {
	const [note, setNote] = useState("");
	const [photo, setPhoto] = useState<string | null>(null);
	const [recipeIds, setRecipeIds] = useState<string[]>([]);

	const recipeNotesResult = useGetRecipeNotes();
	const createRecipeNote = useCreateRecipeNote();
	const recipeNotes = recipeNotesResult.data ?? [];

	const handleSubmit = () => {
		const trimmedNote = note.trim();

		if (!trimmedNote) {
			toast.error("Please enter a note.");
			return;
		}

		createRecipeNote.mutate(
			{
				note: trimmedNote,
				photo,
				recipe_ids: recipeIds,
			},
			{
				onSuccess: () => {
					setNote("");
					setPhoto(null);
					setRecipeIds([]);
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
												{recipeNote.note}
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

			<Card>
				<CardHeader>
					<CardTitle>Create Note</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="recipe-note">Note</Label>
						<Textarea
							id="recipe-note"
							value={note}
							onChange={(event) => setNote(event.currentTarget.value)}
							placeholder="What happened when you cooked this?"
							rows={5}
						/>
					</div>

					<div className="space-y-2">
						<Label>Recipes</Label>
						<RecipeMultiSelect value={recipeIds} onChange={setRecipeIds} />
					</div>

					<div className="space-y-3">
						<Label>Photo</Label>
						<div className="flex flex-wrap items-center gap-3">
							<UploadButton
								text={photo ? "Replace Image" : "Upload Image"}
								disabled={createRecipeNote.isPending}
								onUploaded={(fileName) => {
									setPhoto(fileName);
									toast.success("Image uploaded.");
								}}
							/>
							{photo ? (
								<Button
									type="button"
									variant="ghost"
									onClick={() => setPhoto(null)}
								>
									Remove Image
								</Button>
							) : null}
						</div>

						{photo ? (
							<img
								src={getPhotoUrl(photo)}
								alt="Uploaded recipe note"
								className="max-h-72 w-full rounded-lg border object-cover md:max-w-md"
							/>
						) : null}
					</div>

					<div className="flex justify-end">
						<Button
							onClick={handleSubmit}
							disabled={createRecipeNote.isPending}
						>
							{createRecipeNote.isPending ? "Creating..." : "Create Note"}
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
