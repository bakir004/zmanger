import type {
	TestBatchInsert,
	TestBatchUpdate,
	TestBatchWithoutTests,
} from "src/entities/models/test-batch";

export interface ITestBatchesRepository {
	createTestBatch(
		testBatch: TestBatchInsert,
		tx?: any,
	): Promise<TestBatchWithoutTests>;
	getTestBatchesWithoutTests(): Promise<TestBatchWithoutTests[]>;
	getTestBatchById(id: number): Promise<TestBatchWithoutTests | null>;
	updateTestBatch(
		id: number,
		updates: TestBatchUpdate,
		tx?: any,
	): Promise<TestBatchWithoutTests>;
	deleteTestBatch(id: number, tx?: any): Promise<void>;
}
