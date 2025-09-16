"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Button } from "app/_components/ui/button";
import { Input } from "app/_components/ui/input";
import { Textarea } from "app/_components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "app/_components/ui/select";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "app/_components/ui/card";
import { Badge } from "app/_components/ui/badge";
import { Bell, Send, Loader2, CheckCircle, Trash2 } from "lucide-react";
import { useCreateNotification } from "./hooks/use-create-notification";
import { useNotifications } from "./hooks/use-notifications";
import { useDeleteNotification } from "./hooks/use-delete-notification";
import type { NotificationInsert } from "~/entities/models/notification";

export default function NotifyPage() {
	const { user, isLoaded } = useUser();

	const [formData, setFormData] = useState<NotificationInsert>({
		title: "",
		description: "",
		type: "info",
		actionUrl: "",
		actionLabel: "",
	});

	const createNotification = useCreateNotification();
	const deleteNotification = useDeleteNotification();
	const { data: notifications, isLoading: notificationsLoading } =
		useNotifications();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!formData.title.trim()) return;

		try {
			await createNotification.mutateAsync({
				...formData,
				description: formData.description || undefined,
				actionUrl: formData.actionUrl || undefined,
				actionLabel: formData.actionLabel || undefined,
			});

			// Reset form
			setFormData({
				title: "",
				description: "",
				type: "info",
				actionUrl: "",
				actionLabel: "",
			});
		} catch (error) {
			console.error("Failed to create notification:", error);
		}
	};

	const handleInputChange = (
		field: keyof NotificationInsert,
		value: string,
	) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
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

	if (!isLoaded) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<Loader2 className="h-8 w-8 animate-spin" />
			</div>
		);
	}

	return (
		<div className="container mx-auto px-6 py-8">
			<div className="flex items-center gap-3 mb-8">
				<Bell className="h-8 w-8 text-blue-500" />
				<div>
					<h1 className="text-3xl font-bold">Upravljanje obavještenjima</h1>
					<p className="text-muted-foreground">
						Kreirajte i upravljajte obavještenjima za sve korisnike
					</p>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* Create Notification Form */}
				<Card>
					<CardHeader>
						<CardTitle>Novo obavještenje</CardTitle>
						<CardDescription>
							Kreirajte novo obavještenje koje će biti vidljivo svim korisnicima
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div>
								<label
									htmlFor="title"
									className="text-sm font-medium mb-2 block"
								>
									Naslov *
								</label>
								<Input
									id="title"
									value={formData.title}
									onChange={(e) => handleInputChange("title", e.target.value)}
									placeholder="Unesite naslov obavještenja"
									required
								/>
							</div>

							<div>
								<label
									htmlFor="description"
									className="text-sm font-medium mb-2 block"
								>
									Opis
								</label>
								<Textarea
									id="description"
									value={formData.description}
									onChange={(e) =>
										handleInputChange("description", e.target.value)
									}
									placeholder="Opcionalni opis obavještenja"
									rows={3}
								/>
							</div>

							<div>
								<label
									htmlFor="type"
									className="text-sm font-medium mb-2 block"
								>
									Tip obavještenja
								</label>
								<Select
									value={formData.type}
									onValueChange={(value) => handleInputChange("type", value)}
								>
									<SelectTrigger id="type">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="info">Info</SelectItem>
										<SelectItem value="success">Uspjeh</SelectItem>
										<SelectItem value="warning">Upozorenje</SelectItem>
										<SelectItem value="error">Greška</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div>
								<label
									htmlFor="actionUrl"
									className="text-sm font-medium mb-2 block"
								>
									URL akcije
								</label>
								<Input
									id="actionUrl"
									value={formData.actionUrl}
									onChange={(e) =>
										handleInputChange("actionUrl", e.target.value)
									}
									placeholder="https://example.com (opcionalno)"
									type="url"
								/>
							</div>

							<div>
								<label
									htmlFor="actionLabel"
									className="text-sm font-medium mb-2 block"
								>
									Tekst dugmeta
								</label>
								<Input
									id="actionLabel"
									value={formData.actionLabel}
									onChange={(e) =>
										handleInputChange("actionLabel", e.target.value)
									}
									placeholder="Tekst za dugme akcije (opcionalno)"
								/>
							</div>

							<Button
								type="submit"
								className="w-full"
								disabled={
									createNotification.isPending || !formData.title.trim()
								}
							>
								{createNotification.isPending ? (
									<>
										<Loader2 className="h-4 w-4 mr-2 animate-spin" />
										Kreiranje...
									</>
								) : (
									<>
										<Send className="h-4 w-4 mr-2" />
										Kreiraj obavještenje
									</>
								)}
							</Button>
						</form>
					</CardContent>
				</Card>

				{/* Recent Notifications */}
				<Card>
					<CardHeader>
						<CardTitle>Nedavna obavještenja</CardTitle>
						<CardDescription>
							Pregled najnovijih kreiran obavještenja
						</CardDescription>
					</CardHeader>
					<CardContent>
						{notificationsLoading ? (
							<div className="flex items-center justify-center py-8">
								<Loader2 className="h-6 w-6 animate-spin" />
							</div>
						) : notifications && notifications.length > 0 ? (
							<div className="space-y-4 max-h-96 overflow-y-auto">
								{notifications.slice(0, 10).map((notification) => (
									<div
										key={notification.id}
										className="p-4 border rounded-lg bg-muted/30"
									>
										<div className="flex items-start justify-between mb-2">
											<h4 className="font-medium">{notification.title}</h4>
											<div className="flex items-center gap-2">
												<Badge
													variant={
														notification.type === "error"
															? "destructive"
															: notification.type === "warning"
																? "secondary"
																: notification.type === "success"
																	? "default"
																	: "outline"
													}
												>
													{notification.type}
												</Badge>
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
											</div>
										</div>
										{notification.description && (
											<p className="text-sm text-muted-foreground mb-2">
												{notification.description}
											</p>
										)}
										<div className="flex items-center justify-between text-xs text-muted-foreground">
											<span>
												{new Date(notification.createdAt).toLocaleString(
													"sr-RS",
												)}
											</span>
											{notification.actionUrl && (
												<CheckCircle className="h-4 w-4 text-green-500" />
											)}
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="text-center py-8 text-muted-foreground">
								<Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
								<p>Nema kreiranih obavještenja</p>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
