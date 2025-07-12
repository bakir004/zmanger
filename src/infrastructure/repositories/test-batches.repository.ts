import type { IInstrumentationService } from "~/application/services/instrumentation.service.interface";
import type { ICrashReporterService } from "~/application/services/crash-reporter.service.interface";
import type { ITestBatchesRepository } from "~/application/repositories/test-batches.repository.interface";
import type {
	TestBatchInsert,
	TestBatchWithoutTests,
} from "~/entities/models/test-batch";
import { db, type Transaction } from "drizzle";
import { DatabaseOperationError } from "~/entities/errors/common";
import { testBatches } from "drizzle/schema";

export class TestBatchesRepository implements ITestBatchesRepository {
	constructor(
		private readonly instrumentationService: IInstrumentationService,
		private readonly crashReporterService: ICrashReporterService,
	) {}

	async createTestBatch(
		testBatch: TestBatchInsert,
		tx?: Transaction,
	): Promise<TestBatchWithoutTests> {
		const invoker = tx ?? db;

		return await this.instrumentationService.startSpan(
			{ name: "TestBatchesRepository > createTestBatch" },
			async () => {
				try {
					const query = invoker
						.insert(testBatches)
						.values(testBatch)
						.returning();

					const [created] = await this.instrumentationService.startSpan(
						{
							name: query.toSQL().sql,
							op: "db.query",
							attributes: { "db.system": "sqlite" },
						},
						() => query.execute(),
					);

					if (created) return created;

					throw new DatabaseOperationError("Cannot create test batch");
				} catch (err) {
					this.crashReporterService.report(err);
					throw err; // TODO: convert to Entities error
				}
			},
		);
	}

	async getTestBatchesWithoutTests(): Promise<TestBatchWithoutTests[]> {
		return await this.instrumentationService.startSpan(
			{ name: "TestBatchesRepository > getTestBatches" },
			async () => {
				try {
					const query = db.query.testBatches.findMany();

					const testBatches = await this.instrumentationService.startSpan(
						{
							name: query.toSQL().sql,
							op: "db.query",
							attributes: { "db.system": "sqlite" },
						},
						() => query.execute(),
					);

					return testBatches ?? [];
				} catch (error) {
					this.crashReporterService.report(error);
					throw error; // TODO: convert to Entities error
				}
			},
		);
	}
}
