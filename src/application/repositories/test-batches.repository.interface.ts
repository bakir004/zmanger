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
	// getTestBatch(id: number): Promise<TestBatch | undefined>;
	// getTestBatchesForUser(userId: string): Promise<TestBatch[]>;
	// updateTestBatch(
	// 	id: number,
	// 	input: Partial<InsertTestBatch>,
	// 	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	// 	tx?: any,
	// ): Promise<TestBatch>;
	// // biome-ignore lint/suspicious/noExplicitAny: <explanation>
	// deleteTestBatch(id: number, tx?: any): Promise<void>;
}
