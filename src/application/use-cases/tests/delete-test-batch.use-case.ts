import type { IInstrumentationService } from "~/application/services/instrumentation.service.interface";
import type { ITestBatchesRepository } from "~/application/repositories/test-batches.repository.interface";

export type IDeleteTestBatchUseCase = ReturnType<typeof deleteTestBatchUseCase>;

export const deleteTestBatchUseCase =
	(
		instrumentationService: IInstrumentationService,
		testBatchesRepository: ITestBatchesRepository,
	) =>
	async (input: { id: number }): Promise<void> => {
		return instrumentationService.startSpan(
			{ name: "deleteTestBatchUseCase", op: "function" },
			async () => {
				// Authorization goes here
				await testBatchesRepository.deleteTestBatch(input.id);
			},
		);
	};
