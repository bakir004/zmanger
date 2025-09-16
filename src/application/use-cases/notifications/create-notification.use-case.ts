import type { IInstrumentationService } from "~/application/services/instrumentation.service.interface";
import type { INotificationsRepository } from "~/application/repositories/notifications.repository.interface";
import type {
	Notification,
	NotificationInsert,
} from "~/entities/models/notification";

export type ICreateNotificationUseCase = ReturnType<
	typeof createNotificationUseCase
>;

export const createNotificationUseCase =
	(
		instrumentationService: IInstrumentationService,
		notificationsRepository: INotificationsRepository,
	) =>
	async (input: {
		notification: NotificationInsert;
	}): Promise<Notification> => {
		return instrumentationService.startSpan(
			{ name: "createNotificationUseCase", op: "function" },
			async () => {
				const createdNotification =
					await notificationsRepository.createNotification(input.notification);
				return createdNotification;
			},
		);
	};
