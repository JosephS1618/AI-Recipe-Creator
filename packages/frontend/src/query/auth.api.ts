import type { AuthUser, LoginInput, RegisterInput } from "./auth.types";
import { type ApiResponse, apiClient } from "./request.utils";

export async function login(input: LoginInput): Promise<AuthUser> {
	const response = await apiClient.post<ApiResponse<AuthUser>>(
		"/auth/login",
		input,
	);
	return response.data.data;
}

export async function register(input: RegisterInput): Promise<AuthUser> {
	const response = await apiClient.post<ApiResponse<AuthUser>>(
		"/auth/register",
		input,
	);
	return response.data.data;
}

export async function getCurrentUser(): Promise<AuthUser> {
	const response = await apiClient.get<ApiResponse<AuthUser>>("/auth/me");
	return response.data.data;
}
