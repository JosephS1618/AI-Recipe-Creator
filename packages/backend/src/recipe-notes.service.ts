import { randomUUID } from "node:crypto";
import { Injectable, NotFoundException } from "@nestjs/common";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { sql } from "./sql";

export const RecipeNoteRecipeSchema = z.object({
	recipe_id: z.string().uuid(),
	name: z.string(),
});

export const RecipeNoteSchema = z.object({
	recipe_note_id: z.string().uuid(),
	photo: z.string().nullable(),
	note: z.string(),
	account_id: z.string().uuid(),
	creation_date: z.string(),
	modification_date: z.string(),
	recipes: z.array(RecipeNoteRecipeSchema),
});

export const RecipeNoteListItemSchema = RecipeNoteSchema.omit({
	recipes: true,
});

export const CreateRecipeNoteSchema = z.object({
	note: z.string().trim().min(1),
	photo: z.string().trim().min(1).nullable().optional(),
	recipe_ids: z.array(z.string().uuid()).default([]),
});

export class CreateRecipeNoteDto extends createZodDto(CreateRecipeNoteSchema) {}

export const UpdateRecipeNoteSchema = CreateRecipeNoteSchema;

export class UpdateRecipeNoteDto extends createZodDto(UpdateRecipeNoteSchema) {}

export const RecipeNoteProjectionColumnSchema = z.enum([
	"recipe_note_id",
	"photo",
	"note",
	"account_id",
	"creation_date",
	"modification_date",
]);

export const ProjectRecipeNotesSchema = z.object({
	columns: z.array(RecipeNoteProjectionColumnSchema).min(1),
});

export class ProjectRecipeNotesDto extends createZodDto(
	ProjectRecipeNotesSchema,
) {}

export type RecipeNoteRecipe = z.infer<typeof RecipeNoteRecipeSchema>;
export type RecipeNote = z.infer<typeof RecipeNoteSchema>;
export type RecipeNoteListItem = z.infer<typeof RecipeNoteListItemSchema>;
export type CreateRecipeNoteBody = z.infer<typeof CreateRecipeNoteSchema>;
export type RecipeNoteProjectionColumn = z.infer<
	typeof RecipeNoteProjectionColumnSchema
>;
export type ProjectRecipeNotesBody = z.infer<typeof ProjectRecipeNotesSchema>;
export type RecipeNoteProjectionResult = {
	columns: RecipeNoteProjectionColumn[];
	rows: (string | null)[][];
};

export type CreateRecipeNote = CreateRecipeNoteBody & {
	account_id: string;
};

export type UpdateRecipeNoteBody = z.infer<typeof UpdateRecipeNoteSchema>;

export type UpdateRecipeNote = UpdateRecipeNoteBody & {
	recipe_note_id: string;
	account_id: string;
};

type RecipeNoteRow = {
	recipe_note_id: string;
	photo: string | null;
	note: string;
	account_id: string;
	creation_date: string;
	modification_date: string;
	recipe_id: string | null;
	recipe_name: string | null;
};

const recipeNoteProjectionColumns: Record<RecipeNoteProjectionColumn, string> =
	{
		recipe_note_id: "recipenoteid",
		photo: "photo",
		note: "note",
		account_id: "accountid",
		creation_date: "creationdate",
		modification_date: "modificationdate",
	};

@Injectable()
export class RecipeNotesService {
	async list(account_id: string): Promise<RecipeNoteListItem[]> {
		return sql<RecipeNoteListItem[]>`
			SELECT
				RecipeNoteID AS recipe_note_id,
				Photo AS photo,
				Note AS note,
				AccountID AS account_id,
				CreationDate AS creation_date,
				ModificationDate AS modification_date
			FROM RecipeNote
			WHERE AccountID = ${account_id}
			ORDER BY ModificationDate DESC;
		`;
	}

	async create(recipeNote: CreateRecipeNote): Promise<RecipeNote> {
		const recipe_note_id = randomUUID();
		const now = new Date().toISOString();
		const recipeIds = [...new Set(recipeNote.recipe_ids)];

		await sql`
			INSERT INTO RecipeNote (
				RecipeNoteID,
				Photo,
				Note,
				CreationDate,
				ModificationDate,
				AccountID
			)
			VALUES (
				${recipe_note_id},
				${recipeNote.photo ?? null},
				${recipeNote.note},
				${now},
				${now},
				${recipeNote.account_id}
			);
		`;

		for (const recipe_id of recipeIds) {
			await sql`
				INSERT INTO RecipeNoteAnnotatesRecipe (
					RecipeNoteID,
					RecipeID
				)
				VALUES (
					${recipe_note_id},
					${recipe_id}
				);
			`;
		}

		return this.get(recipe_note_id, recipeNote.account_id);
	}

	async get(recipe_note_id: string, account_id: string): Promise<RecipeNote> {
		const [recipeNote] = await this.loadRows(account_id, recipe_note_id);

		if (!recipeNote) {
			throw new NotFoundException("Recipe note not found");
		}

		return recipeNote;
	}

	async update(recipeNote: UpdateRecipeNote): Promise<RecipeNote> {
		const now = new Date().toISOString();
		const recipeIds = [...new Set(recipeNote.recipe_ids)];

		await this.get(recipeNote.recipe_note_id, recipeNote.account_id);

		await sql`
			UPDATE RecipeNote
			SET
				Photo = ${recipeNote.photo ?? null},
				Note = ${recipeNote.note},
				ModificationDate = ${now}
			WHERE RecipeNoteID = ${recipeNote.recipe_note_id}
				AND AccountID = ${recipeNote.account_id};
		`;

		await sql`
			DELETE FROM RecipeNoteAnnotatesRecipe
			WHERE RecipeNoteID = ${recipeNote.recipe_note_id};
		`;

		for (const recipe_id of recipeIds) {
			await sql`
				INSERT INTO RecipeNoteAnnotatesRecipe (
					RecipeNoteID,
					RecipeID
				)
				VALUES (
					${recipeNote.recipe_note_id},
					${recipe_id}
				);
			`;
		}

		return this.get(recipeNote.recipe_note_id, recipeNote.account_id);
	}

	async remove(recipe_note_id: string, account_id: string): Promise<void> {
		await this.get(recipe_note_id, account_id);

		await sql`
			DELETE FROM RecipeNote
			WHERE RecipeNoteID = ${recipe_note_id}
				AND AccountID = ${account_id};
		`;
	}

	async project(
		account_id: string,
		body: ProjectRecipeNotesBody,
	): Promise<RecipeNoteProjectionResult> {
		const columns = body.columns;
		const selectColumns = Object.fromEntries(
			columns.map((column) => [
				column,
				sql(recipeNoteProjectionColumns[column]),
			]),
		);

		// Use sql({ ..., modification_date: sql("modificationdate") }) to create
		// column alias like `"modificationdate" AS "modification_date"` here
		const rows = await sql<Record<string, string | null>[]>`
			SELECT ${sql(selectColumns)}
			FROM RecipeNote
			WHERE AccountID = ${account_id}
			ORDER BY ModificationDate DESC;
		`;

		return {
			columns,
			rows: rows.map((row) => columns.map((column) => row[column] ?? null)),
		};
	}

	private async loadRows(
		account_id: string,
		recipe_note_id?: string,
	): Promise<RecipeNote[]> {
		return this.mapRows(
			await sql<RecipeNoteRow[]>`
				SELECT
					rn.RecipeNoteID AS recipe_note_id,
					rn.Photo AS photo,
					rn.Note AS note,
					rn.AccountID AS account_id,
					rn.CreationDate AS creation_date,
					rn.ModificationDate AS modification_date,
					r.RecipeID AS recipe_id,
					r.Name AS recipe_name
				FROM RecipeNote rn
				LEFT JOIN RecipeNoteAnnotatesRecipe rnar
					ON rnar.RecipeNoteID = rn.RecipeNoteID
				LEFT JOIN Recipe r
					ON r.RecipeID = rnar.RecipeID
				WHERE rn.AccountID = ${account_id}
					${recipe_note_id ? sql`AND rn.RecipeNoteID = ${recipe_note_id}` : sql``}
				ORDER BY rn.ModificationDate DESC, r.Name ASC;
			`,
		);
	}

	private mapRows(rows: RecipeNoteRow[]): RecipeNote[] {
		const recipeNotes = new Map<string, RecipeNote>();

		for (const row of rows) {
			const recipeNote: RecipeNote = recipeNotes.get(row.recipe_note_id) ?? {
				...row,
				recipes: [],
			};

			if (!recipeNotes.has(row.recipe_note_id)) {
				recipeNotes.set(row.recipe_note_id, recipeNote);
			}

			if (row.recipe_id !== null && row.recipe_name !== null) {
				recipeNote.recipes.push({
					recipe_id: row.recipe_id,
					name: row.recipe_name,
				});
			}
		}

		return Array.from(recipeNotes.values());
	}
}
