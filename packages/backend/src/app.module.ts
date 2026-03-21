import { Module } from "@nestjs/common";
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { ZodSerializerInterceptor, ZodValidationPipe } from "nestjs-zod";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { RecipesController } from "./controller/recipes.controller";
import { IngredientController } from "./ingredients.controller";
import { IngredientService } from "./ingredients.service";
import { InventoriesController } from "./inventories.controller";
import { InventoriesService } from "./inventories.service";
import { InventoryItemsController } from "./inventoryItems.controller";
import { InventoryItemsService } from "./inventoryItems.service";
import { ReceiptService } from "./receipt.service";
import { ApiExceptionFilter } from "./response/api-exception.filter";
import { ApiResponseInterceptor } from "./response/api-response.interceptor";
import { RecipesService } from "./service/recipes.service";
import { SubscriptionController } from "./subscription.controller";
import { SubscriptionService } from "./subscription.service";
import { UploadsController } from "./uploads.controller";
import { UploadsService } from "./uploads.service";

@Module({
	imports: [],
	controllers: [
		AuthController,
		IngredientController,
		InventoriesController,
		InventoryItemsController,
		SubscriptionController,
		UploadsController,
		RecipesController,
	],
	providers: [
		{ provide: APP_PIPE, useClass: ZodValidationPipe },
		{ provide: APP_INTERCEPTOR, useClass: ApiResponseInterceptor },
		{ provide: APP_INTERCEPTOR, useClass: ZodSerializerInterceptor },
		{ provide: APP_FILTER, useClass: ApiExceptionFilter },
		AuthService,
		IngredientService,
		InventoriesService,
		ReceiptService,
		InventoryItemsService,
		SubscriptionService,
		UploadsService,
		RecipesService,
	],
})
export class AppModule {}
