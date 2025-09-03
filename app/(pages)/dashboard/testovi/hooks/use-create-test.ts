"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTest } from "../actions";

export function useCreateTest() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (test: {
			testBatchId: number;
			topOfFile: string;
			aboveMain: string;
			main: string;
			stdin: string;
			expectedOutput: string[];
			hidden: boolean;
		}) => createTest(test),
		onSuccess: (_, { testBatchId }) => {
			// Invalidate the specific batch's tests cache to refetch updated data
			queryClient.invalidateQueries({
				queryKey: ["testsByBatchId", testBatchId],
			});
		},
		onError: (error) => {
			console.error("Error creating test:", error);
		},
	});
}
