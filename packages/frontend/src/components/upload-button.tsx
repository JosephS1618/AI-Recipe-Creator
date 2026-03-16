import { useRef } from "react";

import { Button } from "@/components/ui/button";
import { useUploadFile } from "@/query";

type UploadButtonProps = {
	text: string;
	disabled?: boolean;
	onUploaded?: (fileName: string) => void;
};

export function UploadButton({
	text,
	disabled = false,
	onUploaded,
}: UploadButtonProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const uploadFile = useUploadFile();

	return (
		<>
			<input
				ref={fileInputRef}
				type="file"
				className="hidden"
				onChange={(event) => {
					const input = event.currentTarget;
					const file = input.files?.[0];

					if (!file) {
						return;
					}

					uploadFile.mutate(file, {
						onSuccess: ({ fileName }) => {
							onUploaded?.(fileName);
						},
						onSettled: () => {
							input.value = "";
						},
					});
				}}
			/>

			<Button
				type="button"
				variant="outline"
				disabled={disabled || uploadFile.isPending}
				onClick={() => fileInputRef.current?.click()}
			>
				{uploadFile.isPending ? "Uploading..." : text}
			</Button>
		</>
	);
}
