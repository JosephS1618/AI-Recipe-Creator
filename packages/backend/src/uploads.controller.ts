import {
	BadRequestException,
	Controller,
	Post,
	UploadedFile,
	UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

import { type UploadedFileInfo, UploadsService } from "./uploads.service";

type UploadedFilePayload = {
	buffer: Buffer;
	originalname: string;
};

@Controller("uploads")
export class UploadsController {
	constructor(private readonly uploadsService: UploadsService) {}

	@Post()
	@UseInterceptors(FileInterceptor("file"))
	async upload(
		@UploadedFile() file?: UploadedFilePayload,
	): Promise<UploadedFileInfo> {
		if (!file) {
			throw new BadRequestException("File is required");
		}

		return this.uploadsService.saveFile(file);
	}
}
