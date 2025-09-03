"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTestBatch } from "../actions";

export function useDeleteTestBatch() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: number) => deleteTestBatch(id),
		onSuccess: () => {
			// Invalidate the test batches cache to refetch updated data
			queryClient.invalidateQueries({ queryKey: ["testBatches"] });
		},
		onError: (error) => {
			console.error("Error deleting test batch:", error);
		},
	});
}
