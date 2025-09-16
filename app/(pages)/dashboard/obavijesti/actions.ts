"use server";

import { auth } from "@clerk/nextjs/server";
import { getInjection } from "di/container";
import type { NotificationInsert } from "~/entities/models/notification";

export async function createNotification(notification: NotificationInsert) {
	const instrumentationService = getInjection("IInstrumentationService");

	return await instrumentationService.instrumentServerAction(
		"createNotification",
		{ recordResponse: true },
		async () => {
			try {
				const { userId } = await auth();
				if (!userId) {
					throw new Error("Unauthorized");
				}

				const createNotificationController = getInjection(
					"ICreateNotificationController",
				);
				return await createNotificationController(userId, { notification });
			} catch (error) {
				console.error("Error creating notification:", error);
				throw error;
			}
		},
	);
}

export async function getNotifications() {
	const instrumentationService = getInjection("IInstrumentationService");

	return await instrumentationService.instrumentServerAction(
		"getNotifications",
		{ recordResponse: true },
		async () => {
			try {
				const { userId } = await auth();
				if (!userId) {
					throw new Error("Unauthorized");
				}

				const getNotificationsController = getInjection(
					"IGetNotificationsController",
				);
				return await getNotificationsController(userId);
			} catch (error) {
				console.error("Error fetching notifications:", error);
				throw error;
			}
		},
	);
}

export async function deleteNotification(id: number) {
	const instrumentationService = getInjection("IInstrumentationService");

	return await instrumentationService.instrumentServerAction(
		"deleteNotification",
		{ recordResponse: true },
		async () => {
			try {
				const { userId } = await auth();
				if (!userId) {
					throw new Error("Unauthorized");
				}

				const deleteNotificationController = getInjection(
					"IDeleteNotificationController",
				);
				return await deleteNotificationController(userId, id);
			} catch (error) {
				console.error("Error deleting notification:", error);
				throw error;
			}
		},
	);
}
