import {
	createParamDecorator,
	type ExecutionContext,
	UnauthorizedException,
} from "@nestjs/common";
import type { Request } from "express";

export const CURRENT_ACCOUNT_ID_HEADER = "x-account-id";

export const CurrentAccountId = createParamDecorator(
	(_data: unknown, context: ExecutionContext): string => {
		const request = context.switchToHttp().getRequest<Request>();
		const headerValue = request.headers[CURRENT_ACCOUNT_ID_HEADER];
		const accountId = Array.isArray(headerValue) ? headerValue[0] : headerValue;

		if (!accountId) {
			throw new UnauthorizedException(
				`Missing ${CURRENT_ACCOUNT_ID_HEADER} header`,
			);
		}

		return accountId;
	},
);
