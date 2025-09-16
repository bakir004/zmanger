import type { IInstrumentationService } from "~/application/services/instrumentation.service.interface";
import type { ICrashReporterService } from "~/application/services/crash-reporter.service.interface";
import type { INotificationsRepository } from "~/application/repositories/notifications.repository.interface";
import type {
	Notification,
	NotificationInsert,
} from "~/entities/models/notification";
import { db } from "drizzle";
import { DatabaseOperationError } from "~/entities/errors/common";
import { notifications } from "drizzle/schema";
import { eq } from "drizzle-orm";

export class NotificationsRepository implements INotificationsRepository {
	constructor(
		private readonly instrumentationService: IInstrumentationService,
		private readonly crashReporterService: ICrashReporterService,
	) {}

	async createNotification(
		notification: NotificationInsert,
	): Promise<Notification> {
		return await this.instrumentationService.startSpan(
			{ name: "NotificationsRepository > createNotification" },
			async () => {
				try {
					const query = db
						.insert(notifications)
						.values(notification)
						.returning();

					const [created] = await this.instrumentationService.startSpan(
						{
							name: query.toSQL().sql,
							op: "db.query",
							attributes: { "db.system": "postgres" },
						},
						() => query.execute(),
					);

					if (created) return created;

					throw new DatabaseOperationError("Cannot create notification");
				} catch (err) {
					this.crashReporterService.report(err);
					throw err;
				}
			},
		);
	}

	async getAllNotifications(): Promise<Notification[]> {
		return await this.instrumentationService.startSpan(
			{ name: "NotificationsRepository > getAllNotifications" },
			async () => {
				try {
					const query = db.query.notifications.findMany({
						orderBy: (notifications, { desc }) => [
							desc(notifications.createdAt),
						],
					});

					const allNotifications = await this.instrumentationService.startSpan(
						{
							name: query.toSQL().sql,
							op: "db.query",
							attributes: { "db.system": "postgres" },
						},
						() => query.execute(),
					);

					return allNotifications ?? [];
				} catch (error) {
					this.crashReporterService.report(error);
					throw error;
				}
			},
		);
	}

	async deleteNotification(id: number): Promise<void> {
		return await this.instrumentationService.startSpan(
			{ name: "NotificationsRepository > deleteNotification" },
			async () => {
				try {
					const query = db
						.delete(notifications)
						.where(eq(notifications.id, id));

					await this.instrumentationService.startSpan(
						{
							name: query.toSQL().sql,
							op: "db.query",
							attributes: { "db.system": "postgres" },
						},
						() => query.execute(),
					);
				} catch (error) {
					this.crashReporterService.report(error);
					throw error;
				}
			},
		);
	}
}
