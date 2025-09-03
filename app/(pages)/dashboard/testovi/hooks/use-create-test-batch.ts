"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTestBatch } from "../dodaj/actions";
import type { Tests } from "../dodaj/_utils/formatter";

export function useCreateTestBatch() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createTestBatch,
		onSuccess: () => {
			// Invalidate and refetch test batches after successful creation
			queryClient.invalidateQueries({ queryKey: ["testBatches"] });
		},
		onError: (error) => {
			console.error("Error creating test batch:", error);
		},
	});
}
