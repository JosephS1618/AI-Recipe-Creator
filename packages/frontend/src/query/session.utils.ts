import type { AuthUser } from "./auth.types";
import { CURRENT_USER_STORAGE_KEY } from "./constants";

export function getStoredCurrentUser(): AuthUser | null {
	if (typeof window === "undefined") {
		return null;
	}

	const storedUser = window.localStorage.getItem(CURRENT_USER_STORAGE_KEY);
	if (!storedUser) {
		return null;
	}

	try {
		return JSON.parse(storedUser) as AuthUser;
	} catch {
		window.localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
		return null;
	}
}

export function persistCurrentUser(user: AuthUser | null): void {
	if (typeof window === "undefined") {
		return;
	}

	if (user) {
		window.localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
		return;
	}

	window.localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
}
