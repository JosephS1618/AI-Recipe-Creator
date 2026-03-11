import axios, { AxiosError, AxiosHeaders } from "axios";

import { BASE_URL, CURRENT_ACCOUNT_ID_HEADER } from "./constants";
import { getStoredCurrentUser } from "./session.utils";

export type ApiResponse<T> = {
	ok: boolean;
	msg: string;
	data: T;
};

const apiClient = axios.create({
	baseURL: BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

apiClient.interceptors.request.use((config) => {
	const headers = AxiosHeaders.from(config.headers);
	const currentUser = getStoredCurrentUser();

	if (currentUser?.accountId && !headers.has(CURRENT_ACCOUNT_ID_HEADER)) {
		headers.set(CURRENT_ACCOUNT_ID_HEADER, currentUser.accountId);
	}

	config.headers = headers;
	return config;
});

function toApiError(error: unknown): Error {
	if (error instanceof AxiosError) {
		const responseBody = error.response?.data as
			| ApiResponse<unknown>
			| undefined;

		if (responseBody?.msg) {
			return new Error(responseBody.msg);
		}

		if (error.message) {
			return new Error(error.message);
		}
	}

	if (error instanceof Error) {
		return error;
	}

	return new Error("Request failed");
}

apiClient.interceptors.response.use(undefined, (error: unknown) => {
	throw toApiError(error);
});

export { apiClient };
