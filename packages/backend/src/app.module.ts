import { Module } from "@nestjs/common";
import { APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { ZodSerializerInterceptor, ZodValidationPipe } from "nestjs-zod";

import { IngredientController } from "./ingredients.controller";
import { IngredientService } from "./ingredients.service";

@Module({
	imports: [],
	controllers: [IngredientController],
	providers: [
		{ provide: APP_PIPE, useClass: ZodValidationPipe },
		{ provide: APP_INTERCEPTOR, useClass: ZodSerializerInterceptor },
		IngredientService,
	],
})
export class AppModule {}
