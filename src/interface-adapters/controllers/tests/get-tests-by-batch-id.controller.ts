import type { IInstrumentationService } from "~/application/services/instrumentation.service.interface";
import type { IGetTestsByBatchIdUseCase } from "~/application/use-cases/tests/get-tests-by-batch-id.use-case";
import type { Test } from "~/entities/models/test";
import type { TestBatchWithoutTests } from "~/entities/models/test-batch";

export type IGetTestsByBatchIdController = ReturnType<
	typeof getTestsByBatchIdController
>;

export const getTestsByBatchIdController =
	(
		instrumentationService: IInstrumentationService,
		getTestsByBatchIdUseCase: IGetTestsByBatchIdUseCase,
	) =>
	async (testBatchId: number): Promise<Test[]> => {
		return await instrumentationService.startSpan(
			{
				name: "getTestBatchesController",
			},
			async () => {
				const flatTests = await getTestsByBatchIdUseCase(testBatchId);
				const tests = flatTests.map((flatTest) => ({
					id: flatTest.id,
					code: {
						topOfFile: flatTest.topOfFile,
						aboveMain: flatTest.aboveMain,
						main: flatTest.main,
					},
					stdin: flatTest.stdin,
					expectedOutput: flatTest.expectedOutput,
					hidden: flatTest.hidden,
					testBatchId: flatTest.testBatchId,
				}));
				return tests;
			},
		);
	};
