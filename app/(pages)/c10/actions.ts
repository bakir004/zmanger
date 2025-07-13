"use server";

import { getInjection } from "di/container";
import type { Test, TestWithUserCodeAndLanguage } from "~/entities/models/test";

export async function getTestBatches() {
	const instrumentationService = getInjection("IInstrumentationService");

	return await instrumentationService.instrumentServerAction(
		"getTestBatches",
		{ recordResponse: true },
		async () => {
			try {
				const getTestBatchesController = getInjection(
					"IGetTestBatchesController",
				);
				return await getTestBatchesController();
			} catch (error) {
				console.error(error);
			}
		},
	);
}

export async function getTestsByBatchId(testBatchId: number) {
	const instrumentationService = getInjection("IInstrumentationService");

	return await instrumentationService.instrumentServerAction(
		"getTestsByBatchId",
		{ recordResponse: true },
		async () => {
			try {
				const getTestsByBatchIdController = getInjection(
					"IGetTestsByBatchIdController",
				);
				return await getTestsByBatchIdController(testBatchId);
			} catch (error) {
				console.error(error);
			}
		},
	);
}

export async function runSingleTest({
	code,
	language,
	test,
}: {
	code: string;
	language: string;
	test: Test;
}) {
	const instrumentationService = getInjection("IInstrumentationService");

	return await instrumentationService.instrumentServerAction(
		"runSingleTest",
		{ recordResponse: true },
		async () => {
			try {
				const runSingleTestController = getInjection(
					"IRunSingleTestController",
				);

				const testWithUserCodeAndLanguage: TestWithUserCodeAndLanguage = {
					test: test,
					userCode: code,
					language,
				};

				return await runSingleTestController(
					"asd",
					testWithUserCodeAndLanguage,
				);
			} catch (error) {
				console.error(error);
			}
		},
	);
}
