import type { IInstrumentationService } from "~/application/services/instrumentation.service.interface";
import type { ICrashReporterService } from "~/application/services/crash-reporter.service.interface";
import type { ITestBatchesRepository } from "~/application/repositories/test-batches.repository.interface";
import type {
	TestBatchInsert,
	TestBatchUpdate,
	TestBatchWithoutTests,
} from "~/entities/models/test-batch";
import { db, type Transaction } from "drizzle";
import { DatabaseOperationError } from "~/entities/errors/common";
import { testBatches } from "drizzle/schema";
import { eq } from "drizzle-orm";

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
							attributes: { "db.system": "postgres" },
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
							attributes: { "db.system": "postgres" },
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

	async getTestBatchById(id: number): Promise<TestBatchWithoutTests | null> {
		return await this.instrumentationService.startSpan(
			{ name: "TestBatchesRepository > getTestBatchById" },
			async () => {
				try {
					const query = db.query.testBatches.findFirst({
						where: eq(testBatches.id, id),
					});

					const testBatch = await this.instrumentationService.startSpan(
						{
							name: query.toSQL().sql,
							op: "db.query",
							attributes: { "db.system": "postgres" },
						},
						() => query.execute(),
					);

					return testBatch ?? null;
				} catch (error) {
					this.crashReporterService.report(error);
					throw error; // TODO: convert to Entities error
				}
			},
		);
	}

	async updateTestBatch(
		id: number,
		updates: TestBatchUpdate,
		tx?: Transaction,
	): Promise<TestBatchWithoutTests> {
		const invoker = tx ?? db;

		return await this.instrumentationService.startSpan(
			{ name: "TestBatchesRepository > updateTestBatch" },
			async () => {
				try {
					const query = invoker
						.update(testBatches)
						.set(updates)
						.where(eq(testBatches.id, id))
						.returning();

					const [updated] = await this.instrumentationService.startSpan(
						{
							name: query.toSQL().sql,
							op: "db.query",
							attributes: { "db.system": "postgres" },
						},
						() => query.execute(),
					);

					if (updated) return updated;

					throw new DatabaseOperationError("Cannot update test batch");
				} catch (err) {
					this.crashReporterService.report(err);
					throw err; // TODO: convert to Entities error
				}
			},
		);
	}

	async deleteTestBatch(id: number, tx?: Transaction): Promise<void> {
		const invoker = tx ?? db;

		return await this.instrumentationService.startSpan(
			{ name: "TestBatchesRepository > deleteTestBatch" },
			async () => {
				try {
					const query = invoker
						.delete(testBatches)
						.where(eq(testBatches.id, id));

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
