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
import { ZodValidationException } from "nestjs-zod";
import { fromError } from "zod-validation-error/v3";

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

		const msg = this.getExceptionMessage(exception);

		this.logger.error(
			`Request failed with status ${status}: ${msg}`,
			exception instanceof Error ? exception.stack : undefined,
		);

		response.status(status).json({
			ok: false,
			msg,
			data: null,
		} satisfies ApiResponse<null>);
	}

	private getExceptionMessage(exception: unknown): string {
		if (exception instanceof ZodValidationException) {
			return fromError(exception.getZodError())
				.toString()
				.replace(/^Validation error: /g, "");
		}

		if (exception instanceof Error) {
			return exception.message;
		}

		return inspect(exception);
	}
}
