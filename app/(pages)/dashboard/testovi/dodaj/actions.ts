"use server";

import { db } from "drizzle";
import { testBatches, tests } from "drizzle/schema";
import type { Tests } from "./_utils/formatter";
import { auth } from "@clerk/nextjs/server";

export async function createTestBatch(testBatch: Tests) {
	try {
		const { userId = undefined } = await auth();
		await createTestBatchController(userId, testBatch);
	} catch (error) {
		console.error(error);
	}
}
