import type { ITestBatchesRepository } from "~/application/repositories/test-batches.repository.interface";
import type {
	TestBatchUpdate,
	TestBatchWithoutTests,
} from "~/entities/models/test-batch";

export type IUpdateTestBatchUseCase = ReturnType<typeof updateTestBatchUseCase>;

export const updateTestBatchUseCase =
	(testBatchesRepository: ITestBatchesRepository) =>
	async (
		id: number,
		updates: TestBatchUpdate,
	): Promise<TestBatchWithoutTests> => {
		return await testBatchesRepository.updateTestBatch(id, updates);
	};
