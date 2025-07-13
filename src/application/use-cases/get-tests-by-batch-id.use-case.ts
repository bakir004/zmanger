import type { IInstrumentationService } from "~/application/services/instrumentation.service.interface";
import type { ITestsRepository } from "../repositories/tests.repository.interface";
import type { FlatTest } from "~/entities/models/test";

export type IGetTestsByBatchIdUseCase = ReturnType<
	typeof getTestsByBatchIdUseCase
>;

export const getTestsByBatchIdUseCase =
	(
		instrumentationService: IInstrumentationService,
		testsRepository: ITestsRepository,
	) =>
	(testBatchId: number): Promise<FlatTest[]> => {
		return instrumentationService.startSpan(
			{ name: "getTestsByBatchIdUseCase", op: "function" },
			async () => {
				return await testsRepository.getTestsByTestBatchId(testBatchId);
			},
		);
	};
