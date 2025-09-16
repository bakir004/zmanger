import { createModule } from "@evyweb/ioctopus";

import { createNotificationController } from "~/interface-adapters/controllers/notifications/create-notification.controller";
import { getNotificationsController } from "~/interface-adapters/controllers/notifications/get-notifications.controller";
import { deleteNotificationController } from "~/interface-adapters/controllers/notifications/delete-notification.controller";

import { DI_SYMBOLS } from "di/types";
import { NotificationsRepository } from "~/infrastructure/repositories/notifications.repository";
import { createNotificationUseCase } from "~/application/use-cases/notifications/create-notification.use-case";
import { getNotificationsUseCase } from "~/application/use-cases/notifications/get-notifications.use-case";
import { deleteNotificationUseCase } from "~/application/use-cases/notifications/delete-notification.use-case";

export function createNotificationsModule() {
	const notificationsModule = createModule();

	notificationsModule
		.bind(DI_SYMBOLS.INotificationsRepository)
		.toClass(NotificationsRepository, [
			DI_SYMBOLS.IInstrumentationService,
			DI_SYMBOLS.ICrashReporterService,
		]);

	notificationsModule
		.bind(DI_SYMBOLS.ICreateNotificationController)
		.toHigherOrderFunction(createNotificationController, [
			DI_SYMBOLS.IInstrumentationService,
			DI_SYMBOLS.ICreateNotificationUseCase,
		]);

	notificationsModule
		.bind(DI_SYMBOLS.ICreateNotificationUseCase)
		.toHigherOrderFunction(createNotificationUseCase, [
			DI_SYMBOLS.IInstrumentationService,
			DI_SYMBOLS.INotificationsRepository,
		]);

	notificationsModule
		.bind(DI_SYMBOLS.IGetNotificationsController)
		.toHigherOrderFunction(getNotificationsController, [
			DI_SYMBOLS.IInstrumentationService,
			DI_SYMBOLS.IGetNotificationsUseCase,
		]);

	notificationsModule
		.bind(DI_SYMBOLS.IGetNotificationsUseCase)
		.toHigherOrderFunction(getNotificationsUseCase, [
			DI_SYMBOLS.IInstrumentationService,
			DI_SYMBOLS.INotificationsRepository,
		]);

	notificationsModule
		.bind(DI_SYMBOLS.IDeleteNotificationController)
		.toHigherOrderFunction(deleteNotificationController, [
			DI_SYMBOLS.IInstrumentationService,
			DI_SYMBOLS.IDeleteNotificationUseCase,
		]);

	notificationsModule
		.bind(DI_SYMBOLS.IDeleteNotificationUseCase)
		.toHigherOrderFunction(deleteNotificationUseCase, [
			DI_SYMBOLS.IInstrumentationService,
			DI_SYMBOLS.INotificationsRepository,
		]);

	return notificationsModule;
}
