"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTestBatch } from "../actions";
import type { TestBatchUpdate } from "~/entities/models/test-batch";

export function useUpdateTestBatch() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, updates }: { id: number; updates: TestBatchUpdate }) =>
			updateTestBatch(id, updates),
		onSuccess: (_, { id }) => {
			// Invalidate and refetch test batches after successful update
			queryClient.invalidateQueries({ queryKey: ["testBatches"] });
			// Also invalidate the specific batch's tests to refetch updated data
			queryClient.invalidateQueries({ queryKey: ["testsByBatchId", id] });
		},
		onError: (error) => {
			console.error("Error updating test batch:", error);
		},
	});
}
