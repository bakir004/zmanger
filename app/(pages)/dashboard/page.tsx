"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "app/_components/ui/card";
import { Badge } from "app/_components/ui/badge";
import { Button } from "app/_components/ui/button";
import {
	Bell,
	Trash2,
	CheckCircle,
	Loader2,
	Plus,
	RefreshCw,
	Info,
	CheckCircle2,
	AlertTriangle,
	XCircle,
} from "lucide-react";
import { useNotifications } from "./obavijesti/hooks/use-notifications";
import { useDeleteNotification } from "./obavijesti/hooks/use-delete-notification";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { UserSubmissionsOverview } from "./_components/user-submissions-overview";

export default function DashboardPage() {
	const { user } = useUser();
	const userRole = user?.publicMetadata?.role as string;
	const {
		data: notifications,
		isLoading: notificationsLoading,
		refetch,
	} = useNotifications();
	const deleteNotification = useDeleteNotification();

	const getNotificationIcon = (type: string) => {
		switch (type) {
			case "info":
				return <Info className="h-4 w-4 text-blue-500" />;
			case "success":
				return <CheckCircle2 className="h-4 w-4 text-green-500" />;
			case "warning":
				return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
			case "error":
				return <XCircle className="h-4 w-4 text-red-500" />;
			default:
				return <Info className="h-4 w-4 text-blue-500" />;
		}
	};

	const handleDeleteNotification = async (id: number, e: React.MouseEvent) => {
		e.stopPropagation();
		if (
			window.confirm("Da li ste sigurni da želite obrisati ovo obavještenje?")
		) {
			try {
				await deleteNotification.mutateAsync(id);
			} catch (error) {
				console.error("Failed to delete notification:", error);
			}
		}
	};

	return (
		<div className="space-y-6 px-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
					<p className="text-muted-foreground">
						Dobrodošli u vaš kontrolni panel
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						onClick={() => refetch()}
						disabled={notificationsLoading}
					>
						<RefreshCw
							className={`h-4 w-4 mr-2 ${notificationsLoading ? "animate-spin" : ""}`}
						/>
						Osvježi
					</Button>
					{userRole === "admin" && (
						<Link href="/dashboard/notify">
							<Button>
								<Plus className="h-4 w-4 mr-2" />
								Kreiraj obavještenje
							</Button>
						</Link>
					)}
				</div>
			</div>

			{/* Notifications Section */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Bell className="h-5 w-5" />
						Obavještenja
					</CardTitle>
					<CardDescription>Najnovija obavještenja i ažuriranja</CardDescription>
				</CardHeader>
				<CardContent>
					{notificationsLoading ? (
						<div className="flex items-center justify-center py-8">
							<Loader2 className="h-6 w-6 animate-spin" />
						</div>
					) : notifications && notifications.length > 0 ? (
						<div className="space-y-4">
							{notifications.map((notification) => (
								<div
									key={notification.id}
									className="p-4 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
								>
									<div className="flex items-start justify-between mb-2">
										<div className="flex items-center gap-2">
											{getNotificationIcon(notification.type)}
											<h4 className="font-medium">{notification.title}</h4>
										</div>
										<div className="flex items-center gap-2">
											{userRole === "admin" && (
												<Button
													variant="ghost"
													size="sm"
													className="text-red-500 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0"
													onClick={(e) =>
														handleDeleteNotification(notification.id, e)
													}
													disabled={deleteNotification.isPending}
												>
													<Trash2 className="h-3 w-3" />
												</Button>
											)}
										</div>
									</div>
									{notification.description && (
										<p className="text-sm text-muted-foreground mb-2">
											{notification.description}
										</p>
									)}
									<div className="flex items-center justify-between text-xs text-muted-foreground">
										<span>
											{new Date(notification.createdAt).toLocaleString("sr-RS")}
										</span>
										{notification.actionUrl && (
											<div className="flex items-center gap-2">
												<CheckCircle className="h-4 w-4 text-green-500" />
												{notification.actionLabel && (
													<Link
														href={notification.actionUrl}
														className="text-blue-500 hover:text-blue-700 hover:underline"
													>
														{notification.actionLabel}
													</Link>
												)}
											</div>
										)}
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="text-center py-8 text-muted-foreground">
							<Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
							<p>Nema obavještenja</p>
							<p className="text-sm mt-2">
								Ovdje će se prikazivati sva važna obavještenja
							</p>
						</div>
					)}
				</CardContent>
			</Card>

			{/* User Submissions Overview Section */}
			<UserSubmissionsOverview />
		</div>
	);
}
