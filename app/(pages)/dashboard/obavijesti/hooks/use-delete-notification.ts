"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNotification } from "../actions";

export function useDeleteNotification() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: number) => deleteNotification(id),
		onSuccess: () => {
			// Invalidate notifications cache to refetch updated data
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
		},
		onError: (error) => {
			console.error("Error deleting notification:", error);
		},
	});
}
