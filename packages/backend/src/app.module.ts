import { Module } from "@nestjs/common";
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { ZodSerializerInterceptor, ZodValidationPipe } from "nestjs-zod";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { IngredientController } from "./ingredients.controller";
import { IngredientService } from "./ingredients.service";
import { InventoryItemsController } from "./inventoryItems.controller";
import { InventoryItemsService } from "./inventoryItems.service";
import { ApiExceptionFilter } from "./response/api-exception.filter";
import { ApiResponseInterceptor } from "./response/api-response.interceptor";
import { SubscriptionController } from "./subscription.controller";
import { SubscriptionService } from "./subscription.service";

@Module({
	imports: [],
	controllers: [
		AuthController,
		IngredientController,
		InventoryItemsController,
		SubscriptionController,
	],
	providers: [
		{ provide: APP_PIPE, useClass: ZodValidationPipe },
		{ provide: APP_INTERCEPTOR, useClass: ApiResponseInterceptor },
		{ provide: APP_INTERCEPTOR, useClass: ZodSerializerInterceptor },
		{ provide: APP_FILTER, useClass: ApiExceptionFilter },
		AuthService,
		IngredientService,
		InventoryItemsService,
		SubscriptionService,
	],
})
export class AppModule {}
