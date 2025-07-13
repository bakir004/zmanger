import type { FlatTest, Test, TestInsert } from "src/entities/models/test";

export interface ITestsRepository {
	createTest(test: TestInsert, tx?: any): Promise<Test>;
	getTestsByTestBatchId(testBatchId: number): Promise<FlatTest[]>;
}
