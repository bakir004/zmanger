import type { IInstrumentationService } from "~/application/services/instrumentation.service.interface";
import type { IDeleteNotificationUseCase } from "~/application/use-cases/notifications/delete-notification.use-case";
import { UnauthenticatedError } from "~/entities/errors/auth";
import { clerkClient } from "@clerk/nextjs/server";

export type IDeleteNotificationController = ReturnType<
	typeof deleteNotificationController
>;

export const deleteNotificationController =
	(
		instrumentationService: IInstrumentationService,
		deleteNotificationUseCase: IDeleteNotificationUseCase,
	) =>
	async (userId: string | undefined, id: number): Promise<void> => {
		return await instrumentationService.startSpan(
			{
				name: "deleteNotificationController",
			},
			async () => {
				if (!userId)
					throw new UnauthenticatedError(
						"Must be logged in to delete notification",
					);

				// Check if user is admin
				const clerk = await clerkClient();
				const user = await clerk.users.getUser(userId);
				const userRole: string = (user.publicMetadata as any)?.role;

				if (userRole !== "admin") {
					throw new UnauthenticatedError(
						"Only admins can delete notifications",
					);
				}

				await deleteNotificationUseCase({ id });
			},
		);
	};
