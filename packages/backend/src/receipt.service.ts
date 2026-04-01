import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from "@nestjs/common";
import { lookup } from "mime-types";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

import { ai, model } from "./ai";
import { IngredientService } from "./ingredients.service";
import { InventoriesService } from "./inventories.service";
import { InventoryItemsService } from "./inventoryItems.service";
import {
	type InventoryItem,
	InventoryItemSchema,
} from "./inventoryItems.types";
import { sql } from "./sql";
import { UploadsService } from "./uploads.service";

export const CreateReceiptSchema = z.object({
	fileName: z.string().trim().min(1, "File name is required"),
});

export const CreateReceiptResultSchema = z.object({
	receiptId: z.string().uuid(),
	createdItems: z.array(InventoryItemSchema),
	createdIngredientNames: z.array(z.string()),
});

const ReceiptInventoryItemSchema = z
	.object({
		ingredient_name: z.string().trim().min(1),
		quantity: z.number().int().positive(),
	})
	.strict();

const ParsedReceiptSchema = z
	.object({
		items: z.array(ReceiptInventoryItemSchema).min(1),
	})
	.strict();

type ParsedReceipt = z.infer<typeof ParsedReceiptSchema> & {
	rawResponse: string;
};
type ReceiptInventoryItem = z.infer<typeof ReceiptInventoryItemSchema>;

export type CreateReceiptInput = z.infer<typeof CreateReceiptSchema>;
export type CreateReceiptResult = z.infer<typeof CreateReceiptResultSchema>;

export class CreateReceiptDto extends createZodDto(CreateReceiptSchema) {}

export class CreateReceiptResultDto extends createZodDto(
	CreateReceiptResultSchema,
) {}

@Injectable()
export class ReceiptService {
	constructor(
		private readonly ingredientService: IngredientService,
		private readonly inventoriesService: InventoriesService,
		private readonly inventoryItemsService: InventoryItemsService,
		private readonly uploadsService: UploadsService,
	) {}

	async addFromReceipt(
		accountId: string,
		inventoryId: string,
		fileName: string,
	): Promise<CreateReceiptResult> {
		await this.inventoriesService.verifyInventoryOwnership(
			accountId,
			inventoryId,
		);
		await this.ensureReceiptNotProcessed(fileName);

		const parsedReceipt = await this.parseReceipt(fileName);

		if (parsedReceipt.items.length === 0) {
			throw new BadRequestException("No inventory items found on the receipt");
		}

		const { createdIngredients, resolvedNames } =
			await this.ingredientService.addMissingIngredientsByAi(
				parsedReceipt.items.map(({ ingredient_name: name }) => name),
			);
		const resolvedReceiptItems = parsedReceipt.items.map((item, index) => ({
			...item,
			ingredient_name: resolvedNames[index] ?? item.ingredient_name,
		}));
		const receiptId = await this.createReceipt({
			accountId,
			fileName,
			ocrResult: parsedReceipt.rawResponse,
		});
		const createdItems = await this.addManyFromReceipt(
			inventoryId,
			resolvedReceiptItems,
			receiptId,
		);

		return {
			receiptId,
			createdItems,
			createdIngredientNames: createdIngredients.map(({ name }) => name),
		};
	}

	private async createReceipt({
		accountId,
		fileName,
		ocrResult,
	}: {
		accountId: string;
		fileName: string;
		ocrResult: string;
	}): Promise<string> {
		const [receipt] = await sql<{ receiptId: string }[]>`
			INSERT INTO Receipt (
				ReceiptID,
				OCRResult,
				ImageFilePath,
				CreationDate,
				AccountID
			)
			VALUES (
				gen_random_uuid(),
				${ocrResult},
				${fileName},
				CURRENT_TIMESTAMP,
				${accountId}
			)
			RETURNING ReceiptID AS "receiptId";
		`;

		if (!receipt) {
			throw new InternalServerErrorException("Failed to save receipt");
		}

		return receipt.receiptId;
	}

	private async ensureReceiptNotProcessed(fileName: string): Promise<void> {
		const [existingReceipt] = await sql<{ receiptId: string }[]>`
			SELECT ReceiptID AS "receiptId"
			FROM Receipt
			WHERE ImageFilePath = ${fileName};
		`;

		if (existingReceipt) {
			throw new BadRequestException("This receipt has already been processed");
		}
	}

	private async addManyFromReceipt(
		inventoryId: string,
		items: ReceiptInventoryItem[],
		receiptId: string,
	): Promise<InventoryItem[]> {
		if (items.length === 0) {
			return [];
		}

		const createdItems: InventoryItem[] = [];

		for (const item of items) {
			createdItems.push(
				await this.inventoryItemsService.add({
					inventory_id: inventoryId,
					quantity: item.quantity,
					creation_date: new Date().toISOString(),
					expiration_date: null,
					ingredient_name: item.ingredient_name,
					receipt_id: receiptId,
				}),
			);
		}

		return createdItems;
	}

	private async parseReceipt(fileName: string): Promise<ParsedReceipt> {
		const uploadedFile = await this.uploadsService.readFile(fileName);
		const mimeType = lookup(uploadedFile.fileName);

		if (!mimeType) {
			throw new Error("Invalid file type");
		}

		// https://ai.google.dev/gemini-api/docs/structured-output?example=recipe#javascript_2
		const response = await ai.models.generateContent({
			model,
			contents: [
				{
					text: [
						"Analyze this grocery receipt image and extract inventory items.",
						"Only include grocery ingredients or simple pantry items that should be added to a home inventory.",
						"Ignore taxes, totals, discounts, loyalty information, store metadata, prepared meals, and non-food household items.",
						"Normalize each ingredient name to a concise common ingredient name in title case.",
						"Merge duplicate ingredients and return integer quantities.",
					].join("\n"),
				},
				{
					inlineData: {
						data: uploadedFile.buffer.toString("base64"),
						mimeType,
					},
				},
			],
			config: {
				responseMimeType: "application/json",
				responseJsonSchema: zodToJsonSchema(ParsedReceiptSchema),
			},
		});

		if (!response.text) {
			throw new Error("Gemini returned an empty response");
		}

		return {
			...ParsedReceiptSchema.parse(JSON.parse(response.text)),
			rawResponse: response.text,
		};
	}
}
