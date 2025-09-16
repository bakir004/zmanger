"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNotification } from "../actions";
import type { NotificationInsert } from "~/entities/models/notification";

export function useCreateNotification() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (notification: NotificationInsert) =>
			createNotification(notification),
		onSuccess: () => {
			// Invalidate notifications cache to refetch updated data
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
		},
		onError: (error) => {
			console.error("Error creating notification:", error);
		},
	});
}
