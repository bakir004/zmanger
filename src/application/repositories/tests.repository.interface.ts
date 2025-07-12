import type { Test, TestInsert } from "src/entities/models/test";
import type { TestBatchWithoutTests } from "~/entities/models/test-batch";

export interface ITestsRepository {
	createTest(test: TestInsert, tx?: any): Promise<Test>;
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
