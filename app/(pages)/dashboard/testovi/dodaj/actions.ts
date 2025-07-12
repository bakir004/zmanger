"use server";

import type { Tests } from "./_utils/formatter";
import { auth } from "@clerk/nextjs/server";
import { getInjection } from "di/container";

export async function createTestBatch(testBatch: Tests) {
	const instrumentationService = getInjection("IInstrumentationService");

	return await instrumentationService.instrumentServerAction(
		"createTestBatch",
		{ recordResponse: true },
		async () => {
			try {
				const { userId } = await auth();
				const userIdString = userId ?? undefined;
				const createTestBatchController = getInjection(
					"ICreateTestBatchController",
				);
				await createTestBatchController(userIdString, testBatch);
			} catch (error) {
				console.error(error);
			}
		},
	);
}
