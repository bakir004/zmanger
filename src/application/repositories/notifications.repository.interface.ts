import type {
	Notification,
	NotificationInsert,
} from "~/entities/models/notification";

export interface INotificationsRepository {
	createNotification(notification: NotificationInsert): Promise<Notification>;
	getAllNotifications(): Promise<Notification[]>;
	deleteNotification(id: number): Promise<void>;
}
