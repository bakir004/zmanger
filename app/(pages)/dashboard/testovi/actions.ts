"use server";

import { auth } from "@clerk/nextjs/server";
import { getInjection } from "di/container";
import type { TestBatchUpdate } from "~/entities/models/test-batch";
import type { TestUpdate } from "~/entities/models/test";

export async function getTestBatches() {
	const instrumentationService = getInjection("IInstrumentationService");

	return await instrumentationService.instrumentServerAction(
		"getTestBatches",
		{ recordResponse: true },
		async () => {
			try {
				const { userId } = await auth();
				if (!userId) {
					throw new Error("Unauthorized");
				}

				const getTestBatchesController = getInjection(
					"IGetTestBatchesController",
				);
				return await getTestBatchesController();
			} catch (error) {
				console.error("Error fetching test batches:", error);
				throw error;
			}
		},
	);
}

export async function updateTestBatch(id: number, updates: TestBatchUpdate) {
	const instrumentationService = getInjection("IInstrumentationService");

	return await instrumentationService.instrumentServerAction(
		"updateTestBatch",
		{ recordResponse: true },
		async () => {
			try {
				const { userId } = await auth();
				if (!userId) {
					throw new Error("Unauthorized");
				}

				const updateTestBatchController = getInjection(
					"IUpdateTestBatchController",
				);
				return await updateTestBatchController(id, updates);
			} catch (error) {
				console.error("Error updating test batch:", error);
				throw error;
			}
		},
	);
}

export async function updateTest(id: number, updates: TestUpdate) {
	const instrumentationService = getInjection("IInstrumentationService");

	return await instrumentationService.instrumentServerAction(
		"updateTest",
		{ recordResponse: true },
		async () => {
			try {
				const { userId } = await auth();
				if (!userId) {
					throw new Error("Unauthorized");
				}

				const updateTestController = getInjection("IUpdateTestController");
				return await updateTestController(id, updates);
			} catch (error) {
				console.error("Error updating test:", error);
				throw error;
			}
		},
	);
}

export async function createTest(test: {
	testBatchId: number;
	topOfFile: string;
	aboveMain: string;
	main: string;
	stdin: string;
	expectedOutput: string[];
	hidden: boolean;
}) {
	const instrumentationService = getInjection("IInstrumentationService");

	return await instrumentationService.instrumentServerAction(
		"createTest",
		{ recordResponse: true },
		async () => {
			try {
				const { userId } = await auth();
				if (!userId) {
					throw new Error("Unauthorized");
				}

				const createTestController = getInjection("ICreateTestController");
				return await createTestController(userId, {
					test: {
						code: {
							topOfFile: test.topOfFile,
							aboveMain: test.aboveMain,
							main: test.main,
						},
						stdin: test.stdin,
						expectedOutput: test.expectedOutput,
						hidden: test.hidden,
						testBatchId: test.testBatchId,
					},
				});
			} catch (error) {
				console.error("Error creating test:", error);
				throw error;
			}
		},
	);
}

export async function deleteTestBatch(id: number) {
	const instrumentationService = getInjection("IInstrumentationService");

	return await instrumentationService.instrumentServerAction(
		"deleteTestBatch",
		{ recordResponse: true },
		async () => {
			try {
				const { userId } = await auth();
				if (!userId) {
					throw new Error("Unauthorized");
				}

				const deleteTestBatchController = getInjection(
					"IDeleteTestBatchController",
				);
				return await deleteTestBatchController(id);
			} catch (error) {
				console.error("Error deleting test batch:", error);
				throw error;
			}
		},
	);
}

export async function deleteTest(id: number) {
	const instrumentationService = getInjection("IInstrumentationService");

	return await instrumentationService.instrumentServerAction(
		"deleteTest",
		{ recordResponse: true },
		async () => {
			try {
				const { userId } = await auth();
				if (!userId) {
					throw new Error("Unauthorized");
				}

				const deleteTestController = getInjection("IDeleteTestController");
				return await deleteTestController(id);
			} catch (error) {
				console.error("Error deleting test:", error);
				throw error;
			}
		},
	);
}
