import type { IInstrumentationService } from "~/application/services/instrumentation.service.interface";
import type { INotificationsRepository } from "~/application/repositories/notifications.repository.interface";

export type IDeleteNotificationUseCase = ReturnType<
	typeof deleteNotificationUseCase
>;

export const deleteNotificationUseCase =
	(
		instrumentationService: IInstrumentationService,
		notificationsRepository: INotificationsRepository,
	) =>
	async (input: { id: number }): Promise<void> => {
		return instrumentationService.startSpan(
			{ name: "deleteNotificationUseCase", op: "function" },
			async () => {
				await notificationsRepository.deleteNotification(input.id);
			},
		);
	};
