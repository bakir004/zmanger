import type { IInstrumentationService } from "~/application/services/instrumentation.service.interface";
import type { IGetTestBatchesUseCase } from "~/application/use-cases/tests/get-test-batches.use-case";
import type { TestBatchWithoutTests } from "~/entities/models/test-batch";

export type IGetTestBatchesController = ReturnType<
	typeof getTestBatchesController
>;

export const getTestBatchesController =
	(
		instrumentationService: IInstrumentationService,
		getTestBatchesUseCase: IGetTestBatchesUseCase,
	) =>
	async (): Promise<TestBatchWithoutTests[]> => {
		return await instrumentationService.startSpan(
			{
				name: "getTestBatchesController",
			},
			async () => {
				return await getTestBatchesUseCase();
			},
		);
	};
