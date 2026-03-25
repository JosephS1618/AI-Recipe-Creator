import type { FormEvent } from "react";
import { toast } from "sonner";

import { RecipeMultiSelect } from "@/components/recipe-multi-select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UploadButton } from "@/components/upload-button";
import { getPhotoUrl } from "@/lib/utils";

export type RecipeNoteFormValue = {
	note: string;
	photo: string | null;
	recipe_ids: string[];
};

type RecipeNoteFormProps = {
	title: string;
	submitLabel: string;
	value: RecipeNoteFormValue;
	onChange: (value: RecipeNoteFormValue) => void;
	onSubmit: (value: RecipeNoteFormValue) => void;
	isSubmitting?: boolean;
};

export function RecipeNoteForm({
	title,
	submitLabel,
	value,
	onChange,
	onSubmit,
	isSubmitting = false,
}: RecipeNoteFormProps) {
	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const trimmedNote = value.note.trim();

		if (!trimmedNote) {
			toast.error("Please enter a note.");
			return;
		}

		onSubmit({
			...value,
			note: trimmedNote,
		});
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="recipe-note">Note</Label>
						<Textarea
							id="recipe-note"
							value={value.note}
							onChange={(event) =>
								onChange({
									...value,
									note: event.currentTarget.value,
								})
							}
							placeholder="What happened when you cooked this?"
							rows={5}
						/>
					</div>

					<div className="space-y-2">
						<Label>Recipes</Label>
						<RecipeMultiSelect
							value={value.recipe_ids}
							onChange={(recipe_ids) =>
								onChange({
									...value,
									recipe_ids,
								})
							}
						/>
					</div>

					<div className="space-y-3">
						<Label>Photo</Label>
						<div className="flex flex-wrap items-center gap-3">
							<UploadButton
								text={value.photo ? "Replace Image" : "Upload Image"}
								disabled={isSubmitting}
								onUploaded={(fileName) => {
									onChange({
										...value,
										photo: fileName,
									});
									toast.success("Image uploaded.");
								}}
							/>
							{value.photo ? (
								<Button
									type="button"
									variant="ghost"
									onClick={() =>
										onChange({
											...value,
											photo: null,
										})
									}
								>
									Remove Image
								</Button>
							) : null}
						</div>

						{value.photo ? (
							<img
								src={getPhotoUrl(value.photo)}
								alt="Uploaded recipe note"
								className="max-h-72 w-full rounded-lg border object-cover md:max-w-md"
							/>
						) : null}
					</div>

					<div className="flex justify-end">
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? "Saving..." : submitLabel}
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
