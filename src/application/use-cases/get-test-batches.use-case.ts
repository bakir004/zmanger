import type { IInstrumentationService } from "~/application/services/instrumentation.service.interface";
import type { ITestBatchesRepository } from "../repositories/test-batches.repository.interface";
import type { TestBatchWithoutTests } from "~/entities/models/test-batch";

export type IGetTestBatchesUseCase = ReturnType<typeof getTestBatchesUseCase>;

export const getTestBatchesUseCase =
	(
		instrumentationService: IInstrumentationService,
		testBatchesRepository: ITestBatchesRepository,
	) =>
	(): Promise<TestBatchWithoutTests[]> => {
		return instrumentationService.startSpan(
			{ name: "getTestBatchesWithoutTests", op: "function" },
			async () => {
				return await testBatchesRepository.getTestBatchesWithoutTests();
			},
		);
	};
