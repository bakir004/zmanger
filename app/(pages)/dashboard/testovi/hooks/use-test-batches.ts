"use client";

import { useQuery } from "@tanstack/react-query";
import { getTestBatches } from "../actions";

export function useTestBatches() {
	return useQuery({
		queryKey: ["testBatches"],
		queryFn: getTestBatches,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
	});
}
