import type {
	FlatTest,
	Test,
	TestInsert,
	TestUpdate,
} from "src/entities/models/test";

export interface ITestsRepository {
	createTest(test: TestInsert, tx?: any): Promise<Test>;
	getTestsByTestBatchId(testBatchId: number): Promise<FlatTest[]>;
	getTestById(id: number): Promise<FlatTest | null>;
	updateTest(id: number, updates: TestUpdate, tx?: any): Promise<Test>;
	deleteTest(id: number, tx?: any): Promise<void>;
}
