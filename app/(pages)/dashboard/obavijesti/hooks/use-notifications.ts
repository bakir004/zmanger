"use client";

import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "../actions";

export function useNotifications() {
	return useQuery({
		queryKey: ["notifications"],
		queryFn: getNotifications,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});
}
