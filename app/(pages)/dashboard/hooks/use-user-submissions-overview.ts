"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserSubmissionsOverview } from "../actions";

export function useUserSubmissionsOverview() {
	return useQuery({
		queryKey: ["user-submissions-overview"],
		queryFn: getUserSubmissionsOverview,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});
}
