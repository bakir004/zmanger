export interface Notification {
	id: number;
	title: string;
	description: string | null;
	type: string;
	actionUrl: string | null;
	actionLabel: string | null;
	createdAt: Date;
}

export interface NotificationInsert {
	title: string;
	description?: string;
	type?: string;
	actionUrl?: string;
	actionLabel?: string;
}
