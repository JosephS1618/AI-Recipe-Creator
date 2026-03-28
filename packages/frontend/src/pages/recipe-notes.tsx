import { move } from "@dnd-kit/helpers";
import { DragDropProvider } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";

import {
	RecipeNoteForm,
	type RecipeNoteFormValue,
} from "@/components/recipe-note-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { cn, formatDate } from "@/lib/utils";
import {
	type RecipeNoteColumn,
	useCreateRecipeNote,
	useGetRecipeNotes,
} from "@/query";

const headerLabels: Record<RecipeNoteColumn, string> = {
	recipe_note_id: "Recipe Note ID",
	photo: "Photo",
	note: "Note",
	account_id: "Account ID",
	creation_date: "Created",
	modification_date: "Updated",
};

export function RecipeNotes() {
	const [headers, setHeaders] = useState<RecipeNoteColumn[]>([
		"note",
		"photo",
		"creation_date",
		"modification_date",
		"recipe_note_id",
		"account_id",
	]);
	const [activeHeaders, setActiveHeaders] = useState<
		Record<RecipeNoteColumn, boolean>
	>({
		note: true,
		photo: true,
		creation_date: true,
		modification_date: false,
		recipe_note_id: true,
		account_id: false,
	});
	const [formValue, setFormValue] = useState<RecipeNoteFormValue>({
		note: "",
		photo: null,
		recipe_ids: [],
	});

	const visibleColumns = headers.filter((header) => activeHeaders[header]);
	const recipeNotesQuery = useGetRecipeNotes(visibleColumns);
	const createRecipeNote = useCreateRecipeNote();
	const tableData = recipeNotesQuery.data;
	const recipeNoteIdIndex = tableData?.columns.indexOf("recipe_note_id") ?? -1;

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

			<div className="space-y-3">
				<DragDropProvider
					onDragEnd={(event) => {
						setHeaders((items) => move(items, event));
					}}
				>
					<div className="flex flex-wrap gap-2">
						{headers.map((header, index) => (
							<Sortable
								key={header}
								id={header}
								index={index}
								active={activeHeaders[header]}
								label={headerLabels[header]}
								onToggle={() => {
									setActiveHeaders((items) => ({
										...items,
										[header]: !items[header],
									}));
								}}
							/>
						))}
					</div>
				</DragDropProvider>

				<p className="text-muted-foreground">
					Drag and drop to reorder columns, click on a column to toggle it on or
					off.
				</p>
			</div>

			<section className="space-y-4">
				{visibleColumns.length === 0 ? (
					<p className="text-sm text-muted-foreground">
						Select at least one column to view recipe notes
					</p>
				) : recipeNotesQuery.isLoading ? (
					<p className="text-sm text-muted-foreground">
						Loading recipe notes...
					</p>
				) : !tableData || tableData.rows.length === 0 ? (
					<p className="text-sm text-muted-foreground">No recipe notes yet.</p>
				) : (
					<Card>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										{tableData.columns.map((column) => (
											<TableHead key={column}>{headerLabels[column]}</TableHead>
										))}
									</TableRow>
								</TableHeader>
								<TableBody>
									{tableData.rows.map((row, rowIndex) => {
										const recipeNoteId =
											recipeNoteIdIndex >= 0 ? row[recipeNoteIdIndex] : null;

										return (
											<TableRow key={recipeNoteId ?? rowIndex}>
												{tableData.columns.map((column, columnIndex) => (
													<TableCell
														key={`${rowIndex}-${column}`}
														className={cn(
															column === "note" &&
																"max-w-md truncate font-medium",
														)}
													>
														{renderCell(column, row[columnIndex], recipeNoteId)}
													</TableCell>
												))}
											</TableRow>
										);
									})}
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

function Sortable({
	id,
	index,
	active,
	label,
	onToggle,
}: {
	id: string;
	index: number;
	active: boolean;
	label: string;
	onToggle: () => void;
}) {
	const [element, setElement] = useState<Element | null>(null);

	useSortable({ id, index, element });

	return (
		<Badge asChild variant="outline">
			<button
				ref={setElement}
				type="button"
				onClick={onToggle}
				aria-pressed={active}
				className={cn("cursor-grab", !active && "opacity-50")}
			>
				{label}
			</button>
		</Badge>
	);
}

function renderCell(
	column: RecipeNoteColumn,
	value: string | null,
	recipeNoteId: string | null,
) {
	if (value === null) {
		return "—";
	}

	if (column === "creation_date" || column === "modification_date") {
		return formatDate(value);
	}

	if (column === "note" && recipeNoteId) {
		return (
			<Link to={`/recipe-notes/${recipeNoteId}`} className="hover:underline">
				{value}
			</Link>
		);
	}

	return value;
}
