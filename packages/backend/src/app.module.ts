import { Module } from "@nestjs/common";
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { ZodSerializerInterceptor, ZodValidationPipe } from "nestjs-zod";

import { IngredientController } from "./ingredients.controller";
import { IngredientService } from "./ingredients.service";
import { ApiExceptionFilter } from "./response/api-exception.filter";
import { ApiResponseInterceptor } from "./response/api-response.interceptor";

@Module({
	imports: [],
	controllers: [IngredientController],
	providers: [
		{ provide: APP_PIPE, useClass: ZodValidationPipe },
		{ provide: APP_INTERCEPTOR, useClass: ApiResponseInterceptor },
		{ provide: APP_INTERCEPTOR, useClass: ZodSerializerInterceptor },
		{ provide: APP_FILTER, useClass: ApiExceptionFilter },
		IngredientService,
	],
})
export class AppModule {}
