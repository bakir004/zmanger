"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTest } from "../actions";

export function useDeleteTest() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, batchId }: { id: number; batchId: number }) =>
			deleteTest(id),
		onSuccess: (_, { batchId }) => {
			// Invalidate the specific batch's tests cache to refetch updated data
			queryClient.invalidateQueries({ queryKey: ["testsByBatchId", batchId] });
		},
		onError: (error) => {
			console.error("Error deleting test:", error);
		},
	});
}
