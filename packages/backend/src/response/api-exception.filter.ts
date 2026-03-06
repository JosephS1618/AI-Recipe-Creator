import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	HttpStatus,
} from "@nestjs/common";
import type { Response } from "express";

import type { ApiResponse } from "./api-response";

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
	catch(exception: unknown, host: ArgumentsHost): void {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();

		const status =
			exception instanceof HttpException
				? exception.getStatus()
				: HttpStatus.INTERNAL_SERVER_ERROR;

		const msg =
			exception instanceof HttpException
				? this.getHttpExceptionMessage(exception)
				: "Internal server error";

		const body: ApiResponse<null> = {
			ok: false,
			msg,
			data: null,
		};

		response.status(status).json(body);
	}

	private getHttpExceptionMessage(exception: HttpException): string {
		const response = exception.getResponse();

		if (typeof response === "string") {
			return response;
		}

		if (typeof response === "object" && response !== null) {
			const { message } = response as { message?: string | string[] };

			if (Array.isArray(message)) {
				return message.join(", ");
			}

			if (typeof message === "string") {
				return message;
			}
		}

		return exception.message;
	}
}
