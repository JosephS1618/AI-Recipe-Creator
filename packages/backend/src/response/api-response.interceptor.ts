import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
	StreamableFile,
} from "@nestjs/common";
import { map } from "rxjs";

import type { ApiResponse } from "./api-response";

@Injectable()
export class ApiResponseInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): any {
		if (context.getType() !== "http") {
			return next.handle();
		}

		return (next.handle() as any).pipe(
			map((data: unknown) => {
				if (data instanceof StreamableFile || this.isApiResponse(data)) {
					return data;
				}

				return {
					ok: true,
					msg: "success",
					data: data === undefined ? null : data,
				} satisfies ApiResponse<unknown>;
			}),
		);
	}

	private isApiResponse(data: unknown): data is ApiResponse<unknown> {
		return (
			typeof data === "object" &&
			data !== null &&
			"ok" in data &&
			"msg" in data &&
			"data" in data
		);
	}
}
