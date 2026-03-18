import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { extname, join, resolve } from "node:path";
import { Injectable } from "@nestjs/common";

export type UploadedFileInfo = {
	fileName: string;
};

export type UploadedFileData = UploadedFileInfo & {
	buffer: Buffer;
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

	async readFile(fileName: string): Promise<UploadedFileData> {
		const targetPath = join(this.uploadsDir, fileName);
		const buffer = await readFile(targetPath);

		return {
			fileName,
			buffer,
		};
	}
}
