import type { IInstrumentationService } from "~/application/services/instrumentation.service.interface";
import type { INotificationsRepository } from "~/application/repositories/notifications.repository.interface";
import type { Notification } from "~/entities/models/notification";

export type IGetNotificationsUseCase = ReturnType<
	typeof getNotificationsUseCase
>;

export const getNotificationsUseCase =
	(
		instrumentationService: IInstrumentationService,
		notificationsRepository: INotificationsRepository,
	) =>
	async (): Promise<Notification[]> => {
		return instrumentationService.startSpan(
			{ name: "getNotificationsUseCase", op: "function" },
			async () => {
				const notifications =
					await notificationsRepository.getAllNotifications();
				return notifications;
			},
		);
	};
