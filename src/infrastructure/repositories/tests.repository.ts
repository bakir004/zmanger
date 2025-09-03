import type { IInstrumentationService } from "~/application/services/instrumentation.service.interface";
import type { ICrashReporterService } from "~/application/services/crash-reporter.service.interface";
import { db, type Transaction } from "drizzle";
import { DatabaseOperationError } from "~/entities/errors/common";
import type { ITestsRepository } from "~/application/repositories/tests.repository.interface";
import type {
	FlatTest,
	FlatTestInsert,
	Test,
	TestInsert,
	TestUpdate,
} from "~/entities/models/test";
import { tests } from "drizzle/schema";
import { eq } from "drizzle-orm";

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
					const flatTest: FlatTestInsert = {
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
							attributes: { "db.system": "postgres" },
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

	async getTestsByTestBatchId(testBatchId: number): Promise<FlatTest[]> {
		return await this.instrumentationService.startSpan(
			{ name: "TestsRepository > getTestsByTestBatchId" },
			async () => {
				try {
					const query = db.query.tests.findMany({
						where: eq(tests.testBatchId, testBatchId),
					});

					const testsOfBatch = await this.instrumentationService.startSpan(
						{
							name: query.toSQL().sql,
							op: "db.query",
							attributes: { "db.system": "postgres" },
						},
						() => query.execute(),
					);

					return testsOfBatch ?? [];
				} catch (error) {
					this.crashReporterService.report(error);
					throw error; // TODO: convert to Entities error
				}
			},
		);
	}

	async getTestById(id: number): Promise<FlatTest | null> {
		return await this.instrumentationService.startSpan(
			{ name: "TestsRepository > getTestById" },
			async () => {
				try {
					const query = db.query.tests.findFirst({
						where: eq(tests.id, id),
					});

					const test = await this.instrumentationService.startSpan(
						{
							name: query.toSQL().sql,
							op: "db.query",
							attributes: { "db.system": "postgres" },
						},
						() => query.execute(),
					);

					return test ?? null;
				} catch (error) {
					this.crashReporterService.report(error);
					throw error; // TODO: convert to Entities error
				}
			},
		);
	}

	async updateTest(
		id: number,
		updates: TestUpdate,
		tx?: Transaction,
	): Promise<Test> {
		const invoker = tx ?? db;

		return await this.instrumentationService.startSpan(
			{ name: "TestsRepository > updateTest" },
			async () => {
				try {
					const query = invoker
						.update(tests)
						.set(updates)
						.where(eq(tests.id, id))
						.returning();

					const [updated] = await this.instrumentationService.startSpan(
						{
							name: query.toSQL().sql,
							op: "db.query",
							attributes: { "db.system": "postgres" },
						},
						() => query.execute(),
					);

					if (updated) {
						const test: Test = {
							id: updated.id,
							code: {
								topOfFile: updated.topOfFile,
								aboveMain: updated.aboveMain,
								main: updated.main,
							},
							expectedOutput: updated.expectedOutput,
							stdin: updated.stdin,
							hidden: updated.hidden,
							testBatchId: updated.testBatchId,
						};
						return test;
					}

					throw new DatabaseOperationError("Cannot update test");
				} catch (err) {
					this.crashReporterService.report(err);
					throw err; // TODO: convert to Entities error
				}
			},
		);
	}

	async deleteTest(id: number, tx?: Transaction): Promise<void> {
		const invoker = tx ?? db;

		return await this.instrumentationService.startSpan(
			{ name: "TestsRepository > deleteTest" },
			async () => {
				try {
					const query = invoker.delete(tests).where(eq(tests.id, id));

					await this.instrumentationService.startSpan(
						{
							name: query.toSQL().sql,
							op: "db.query",
							attributes: { "db.system": "postgres" },
						},
						() => query.execute(),
					);
				} catch (err) {
					this.crashReporterService.report(err);
					throw err; // TODO: convert to Entities error
				}
			},
		);
	}
}
