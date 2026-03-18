import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
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
		const fileName = this.createFileName(file);
		const targetPath = join(this.uploadsDir, fileName);

		await mkdir(this.uploadsDir, { recursive: true });

		if (!existsSync(targetPath)) {
			await writeFile(targetPath, file.buffer);
		}

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

	private createFileName(file: UploadedFilePayload): string {
		const hash = createHash("sha256").update(file.buffer).digest("hex");
		const extension = extname(file.originalname).toLowerCase();

		return `${hash}${extension}`;
	}
}
