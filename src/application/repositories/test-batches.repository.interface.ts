import type {
	TestBatchInsert,
	TestBatchWithoutTests,
} from "src/entities/models/test-batch";

export interface ITestBatchesRepository {
	createTestBatch(
		testBatch: TestBatchInsert,
		tx?: any,
	): Promise<TestBatchWithoutTests>;
	getTestBatchesWithoutTests(): Promise<TestBatchWithoutTests[]>;
}
