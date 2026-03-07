import { inspect } from "node:util";
import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	HttpStatus,
	Logger,
} from "@nestjs/common";
import type { Response } from "express";

import type { ApiResponse } from "./api-response";

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
	private readonly logger = new Logger(ApiExceptionFilter.name);

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
				: this.getUnknownExceptionMessage(exception);

		this.logException(exception, status);

		const body: ApiResponse<null> = {
			ok: false,
			msg,
			data: null,
		};

		response.status(status).json(body);
	}

	private logException(exception: unknown, status: number): void {
		if (exception instanceof Error) {
			this.logger.error(
				`Request failed with status ${status}: ${exception.message}`,
				exception.stack,
			);
			return;
		}

		this.logger.error(
			`Request failed with status ${status}: ${inspect(exception)}`,
		);
	}

	private getUnknownExceptionMessage(exception: unknown): string {
		if (exception instanceof Error) {
			return exception.message;
		}

		return inspect(exception);
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
