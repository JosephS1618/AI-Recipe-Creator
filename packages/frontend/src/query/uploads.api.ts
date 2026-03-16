import { type ApiResponse, apiClient } from "./request.utils";
import type { UploadedFileInfo } from "./uploads.types";

export async function uploadFile(file: File): Promise<UploadedFileInfo> {
	const response = await apiClient.postForm<ApiResponse<UploadedFileInfo>>(
		"/uploads",
		{ file },
	);

	return response.data.data;
}
