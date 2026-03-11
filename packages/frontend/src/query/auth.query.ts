import { useMutation } from "@tanstack/react-query";

import { getCurrentUser, login, register } from "./auth.api";
import type { AuthUser, LoginInput, RegisterInput } from "./auth.types";

export const useLogin = () => {
	return useMutation<AuthUser, Error, LoginInput>({
		mutationFn: login,
	});
};

export const useRegister = () => {
	return useMutation<AuthUser, Error, RegisterInput>({
		mutationFn: register,
	});
};

export const useRefreshCurrentUser = () => {
	return useMutation<AuthUser, Error, void>({
		mutationFn: async () => getCurrentUser(),
	});
};
