import type { IInstrumentationService } from "~/application/services/instrumentation.service.interface";
import type { IGetNotificationsUseCase } from "~/application/use-cases/notifications/get-notifications.use-case";
import type { Notification } from "~/entities/models/notification";
import { UnauthenticatedError } from "~/entities/errors/auth";

export type IGetNotificationsController = ReturnType<
	typeof getNotificationsController
>;

export const getNotificationsController =
	(
		instrumentationService: IInstrumentationService,
		getNotificationsUseCase: IGetNotificationsUseCase,
	) =>
	async (userId: string | undefined): Promise<Notification[]> => {
		return await instrumentationService.startSpan(
			{
				name: "getNotificationsController",
			},
			async () => {
				if (!userId)
					throw new UnauthenticatedError(
						"Must be logged in to view notifications",
					);

				return await getNotificationsUseCase();
			},
		);
	};
