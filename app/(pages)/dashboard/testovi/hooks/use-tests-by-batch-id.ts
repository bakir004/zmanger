"use client";

import { useQuery } from "@tanstack/react-query";
import { getTestsByBatchId } from "../[id]/actions";

export function useTestsByBatchId(batchId: number) {
	return useQuery({
		queryKey: ["testsByBatchId", batchId],
		queryFn: () => getTestsByBatchId(batchId),
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
		enabled: !!batchId, // Only run query when batchId is provided
	});
}
