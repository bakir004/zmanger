"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserSubmissionByBatch } from "../actions";

export function useUserSubmissionByBatch(testBatchId: number) {
	return useQuery({
		queryKey: ["user-submission-by-batch", testBatchId],
		queryFn: () => getUserSubmissionByBatch(testBatchId),
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
		enabled: !!testBatchId, // Only run the query if testBatchId is provided
	});
}
