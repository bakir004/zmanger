"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTest } from "../actions";
import type { TestUpdate } from "~/entities/models/test";

export function useUpdateTest() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			updates,
			batchId,
		}: { id: number; updates: TestUpdate; batchId: number }) =>
			updateTest(id, updates),
		onSuccess: (_, { batchId }) => {
			// Invalidate the specific batch's tests cache to refetch updated data
			queryClient.invalidateQueries({ queryKey: ["testsByBatchId", batchId] });
		},
		onError: (error) => {
			console.error("Error updating test:", error);
		},
	});
}
