import { useMutation } from "@tanstack/react-query";

import { uploadFile } from "./uploads.api";
import type { UploadedFileInfo } from "./uploads.types";

export const useUploadFile = () => {
	return useMutation<UploadedFileInfo, Error, File>({
		mutationFn: uploadFile,
	});
};
