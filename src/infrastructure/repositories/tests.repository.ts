import type { IInstrumentationService } from "~/application/services/instrumentation.service.interface";
import type { ICrashReporterService } from "~/application/services/crash-reporter.service.interface";
import { db, type Transaction } from "drizzle";
import { DatabaseOperationError } from "~/entities/errors/common";
import type { ITestsRepository } from "~/application/repositories/tests.repository.interface";
import type { Test, TestInsert } from "~/entities/models/test";
import { tests } from "drizzle/schema";

type FlatTest = {
	topOfFile: string;
	aboveMain: string;
	main: string;
	stdin: string;
	expectedOutput: string[];
	hidden: boolean;
	testBatchId: number;
};

export class TestsRepository implements ITestsRepository {
	constructor(
		private readonly instrumentationService: IInstrumentationService,
		private readonly crashReporterService: ICrashReporterService,
	) {}

	async createTest(test: TestInsert, tx?: Transaction): Promise<Test> {
		const invoker = tx ?? db;

		return await this.instrumentationService.startSpan(
			{ name: "TestsRepository > createTest" },
			async () => {
				try {
					const flatTest: FlatTest = {
						topOfFile: test.code.topOfFile,
						aboveMain: test.code.aboveMain,
						main: test.code.main,
						stdin: test.stdin,
						expectedOutput: test.expectedOutput,
						hidden: test.hidden,
						testBatchId: test.testBatchId,
					};
					const query = invoker.insert(tests).values(flatTest).returning();

					const [created] = await this.instrumentationService.startSpan(
						{
							name: query.toSQL().sql,
							op: "db.query",
							attributes: { "db.system": "sqlite" },
						},
						() => query.execute(),
					);

					if (created) {
						const test: Test = {
							id: created.id,
							code: {
								topOfFile: created.topOfFile,
								aboveMain: created.aboveMain,
								main: created.main,
							},
							expectedOutput: created.expectedOutput,
							stdin: created.stdin,
							hidden: created.hidden,
							testBatchId: created.testBatchId,
						};
						return test;
					}

					throw new DatabaseOperationError("Cannot create test");
				} catch (err) {
					this.crashReporterService.report(err);
					throw err; // TODO: convert to Entities error
				}
			},
		);
	}
}
