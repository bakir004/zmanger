"use server";

import { auth } from "@clerk/nextjs/server";
import { getInjection } from "di/container";

export async function getTestsByBatchId(batchId: number) {
	const instrumentationService = getInjection("IInstrumentationService");

	return await instrumentationService.instrumentServerAction(
		"getTestsByBatchId",
		{ recordResponse: true },
		async () => {
			try {
				const { userId } = await auth();
				if (!userId) {
					throw new Error("Unauthorized");
				}

				const getTestsByBatchIdController = getInjection(
					"IGetTestsByBatchIdController",
				);
				return await getTestsByBatchIdController(batchId);
			} catch (error) {
				console.error("Error fetching tests by batch ID:", error);
				throw error;
			}
		},
	);
}
