import { join } from "node:path";
import { Module } from "@nestjs/common";
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { ServeStaticModule } from "@nestjs/serve-static";
import { ZodSerializerInterceptor, ZodValidationPipe } from "nestjs-zod";

import { AiRecipeService } from "./ai-recipe.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { CommunityPostController } from "./community-post.controller";
import { CommunityPostService } from "./community-post.service";
import { IngredientController } from "./ingredients.controller";
import { IngredientService } from "./ingredients.service";
import { InventoriesController } from "./inventories.controller";
import { InventoriesService } from "./inventories.service";
import { InventoryItemsController } from "./inventoryItems.controller";
import { InventoryItemsService } from "./inventoryItems.service";
import { PostReactionController } from "./post-reaction.controller";
import { PostReactionService } from "./post-reaction.service";
import { ReceiptService } from "./receipt.service";
import { RecipeNotesController } from "./recipe-notes.controller";
import { RecipeNotesService } from "./recipe-notes.service";
import { RecipesController } from "./recipes.controller";
import { RecipesService } from "./recipes.service";
import { ApiExceptionFilter } from "./response/api-exception.filter";
import { ApiResponseInterceptor } from "./response/api-response.interceptor";
import { SubscriptionController } from "./subscription.controller";
import { SubscriptionService } from "./subscription.service";
import { UploadsController } from "./uploads.controller";
import { UploadsService } from "./uploads.service";

@Module({
	imports: [
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, "..", "uploads"),
			serveRoot: "/uploads",
		}),
	],
	controllers: [
		AuthController,
		CommunityPostController,
		IngredientController,
		InventoriesController,
		InventoryItemsController,
		PostReactionController,
		SubscriptionController,
		UploadsController,
		RecipesController,
		RecipeNotesController,
	],
	providers: [
		{ provide: APP_PIPE, useClass: ZodValidationPipe },
		{ provide: APP_INTERCEPTOR, useClass: ApiResponseInterceptor },
		{ provide: APP_INTERCEPTOR, useClass: ZodSerializerInterceptor },
		{ provide: APP_FILTER, useClass: ApiExceptionFilter },
		AuthService,
		CommunityPostService,
		IngredientService,
		InventoriesService,
		PostReactionService,
		ReceiptService,
		InventoryItemsService,
		SubscriptionService,
		UploadsService,
		AiRecipeService,
		RecipesService,
		RecipeNotesService,
	],
})
export class AppModule {}
