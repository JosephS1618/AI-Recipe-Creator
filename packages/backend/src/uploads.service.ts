import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { extname, join, resolve } from "node:path";
import { Injectable } from "@nestjs/common";

export type UploadedFileInfo = {
	fileName: string;
};

type UploadedFilePayload = {
	buffer: Buffer;
	originalname: string;
};

@Injectable()
export class UploadsService {
	private readonly uploadsDir = resolve(__dirname, "..", "uploads");

	async saveFile(file: UploadedFilePayload): Promise<UploadedFileInfo> {
		const fileName = `${randomUUID()}${extname(file.originalname)}`;
		const targetPath = join(this.uploadsDir, fileName);

		await mkdir(this.uploadsDir, { recursive: true });
		await writeFile(targetPath, file.buffer);

		return { fileName };
	}
}
