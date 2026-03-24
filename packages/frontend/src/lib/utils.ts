import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getPhotoUrl(photo: string | null) {
	if (!photo) {
		return undefined;
	}

	if (photo.startsWith("/")) {
		return photo;
	}

	return `/uploads/${photo}`;
}

export function formatDate(value: string) {
	return new Date(value).toLocaleDateString("en-CA", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
}
