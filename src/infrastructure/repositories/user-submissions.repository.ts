import type { IInstrumentationService } from "~/application/services/instrumentation.service.interface";
import type { ICrashReporterService } from "~/application/services/crash-reporter.service.interface";
import { db, type Transaction } from "drizzle";
import { DatabaseOperationError } from "~/entities/errors/common";
import type { IUserSubmissionsRepository } from "~/application/repositories/user-submissions.repository.interface";
import type {
	UserSubmission,
	UserSubmissionInsert,
	UserSubmissionWithoutTests,
	UserSubmissionTest,
	UserSubmissionTestInsert,
	UserSubmissionOverview,
} from "~/entities/models/user-submission";
import {
	userSubmissions,
	userSubmissionTests,
	testBatches,
} from "drizzle/schema";
import { eq, and, count, sql } from "drizzle-orm";
import { SubmissionStatus } from "~/entities/models/submission-status";

export class UserSubmissionsRepository implements IUserSubmissionsRepository {
	constructor(
		private readonly instrumentationService: IInstrumentationService,
		private readonly crashReporterService: ICrashReporterService,
	) {}

	async createUserSubmission(
		submission: UserSubmissionInsert,
		tx?: Transaction,
	): Promise<UserSubmissionWithoutTests> {
		const invoker = tx ?? db;

		return await this.instrumentationService.startSpan(
			{ name: "UserSubmissionsRepository > createUserSubmission" },
			async () => {
				try {
					const query = invoker
						.insert(userSubmissions)
						.values(submission)
						.returning();

					const [created] = await this.instrumentationService.startSpan(
						{
							name: query.toSQL().sql,
							op: "db.query",
							attributes: { "db.system": "postgres" },
						},
						() => query.execute(),
					);

					if (created) {
						return {
							id: created.id,
							userId: created.userId,
							testBatchId: created.testBatchId,
							createdAt: created.createdAt,
							updatedAt: created.updatedAt,
						};
					}

					throw new DatabaseOperationError("Cannot create user submission");
				} catch (err) {
					this.crashReporterService.report(err);
					throw err;
				}
			},
		);
	}

	async createUserSubmissionTest(
		submissionTest: UserSubmissionTestInsert,
		tx?: Transaction,
	): Promise<UserSubmissionTest> {
		const invoker = tx ?? db;

		return await this.instrumentationService.startSpan(
			{ name: "UserSubmissionsRepository > createUserSubmissionTest" },
			async () => {
				try {
					const query = invoker
						.insert(userSubmissionTests)
						.values(submissionTest)
						.returning();

					const [created] = await this.instrumentationService.startSpan(
						{
							name: query.toSQL().sql,
							op: "db.query",
							attributes: { "db.system": "postgres" },
						},
						() => query.execute(),
					);

					if (created) {
						return {
							id: created.id,
							userSubmissionId: created.userSubmissionId,
							testId: created.testId,
							compileOutput: created.compileOutput,
							stdout: created.stdout,
							stderr: created.stderr,
							time: created.time,
							runtimeStatus: created.runtimeStatus,
							submissionStatus: created.submissionStatus,
							description: created.description,
							createdAt: created.createdAt,
						};
					}

					throw new DatabaseOperationError(
						"Cannot create user submission test",
					);
				} catch (err) {
					this.crashReporterService.report(err);
					throw err;
				}
			},
		);
	}

	async getUserSubmissionByUserAndBatch(
		userId: string,
		testBatchId: number,
	): Promise<UserSubmission | null> {
		return await this.instrumentationService.startSpan(
			{ name: "UserSubmissionsRepository > getUserSubmissionByUserAndBatch" },
			async () => {
				try {
					const query = db.query.userSubmissions.findFirst({
						where: and(
							eq(userSubmissions.userId, userId),
							eq(userSubmissions.testBatchId, testBatchId),
						),
						with: {
							tests: true,
						},
					});

					const submission = await this.instrumentationService.startSpan(
						{
							name: query.toSQL().sql,
							op: "db.query",
							attributes: { "db.system": "postgres" },
						},
						() => query.execute(),
					);

					if (!submission) {
						return null;
					}

					return {
						id: submission.id,
						userId: submission.userId,
						testBatchId: submission.testBatchId,
						tests: submission.tests.map((test) => ({
							id: test.id,
							userSubmissionId: test.userSubmissionId,
							testId: test.testId,
							compileOutput: test.compileOutput,
							stdout: test.stdout,
							stderr: test.stderr,
							time: test.time,
							runtimeStatus: test.runtimeStatus,
							submissionStatus: test.submissionStatus,
							description: test.description,
							createdAt: test.createdAt,
						})),
						createdAt: submission.createdAt,
						updatedAt: submission.updatedAt,
					};
				} catch (error) {
					this.crashReporterService.report(error);
					throw error;
				}
			},
		);
	}

	async getUserSubmissionById(id: number): Promise<UserSubmission | null> {
		return await this.instrumentationService.startSpan(
			{ name: "UserSubmissionsRepository > getUserSubmissionById" },
			async () => {
				try {
					const query = db.query.userSubmissions.findFirst({
						where: eq(userSubmissions.id, id),
						with: {
							tests: true,
						},
					});

					const submission = await this.instrumentationService.startSpan(
						{
							name: query.toSQL().sql,
							op: "db.query",
							attributes: { "db.system": "postgres" },
						},
						() => query.execute(),
					);

					if (!submission) {
						return null;
					}

					return {
						id: submission.id,
						userId: submission.userId,
						testBatchId: submission.testBatchId,
						tests: submission.tests.map((test) => ({
							id: test.id,
							userSubmissionId: test.userSubmissionId,
							testId: test.testId,
							compileOutput: test.compileOutput,
							stdout: test.stdout,
							stderr: test.stderr,
							time: test.time,
							runtimeStatus: test.runtimeStatus,
							submissionStatus: test.submissionStatus,
							description: test.description,
							createdAt: test.createdAt,
						})),
						createdAt: submission.createdAt,
						updatedAt: submission.updatedAt,
					};
				} catch (error) {
					this.crashReporterService.report(error);
					throw error;
				}
			},
		);
	}

	async getUserSubmissionsOverviewByUser(
		userId: string,
	): Promise<UserSubmissionOverview[]> {
		return await this.instrumentationService.startSpan(
			{ name: "UserSubmissionsRepository > getUserSubmissionsOverviewByUser" },
			async () => {
				try {
					const query = db
						.select({
							id: userSubmissions.id,
							userId: userSubmissions.userId,
							testBatchId: userSubmissions.testBatchId,
							testBatchName: testBatches.name,
							totalTests: count(userSubmissionTests.id),
							acceptedTests: sql<number>`count(case when ${userSubmissionTests.submissionStatus} = ${SubmissionStatus.Accepted} then 1 end)`,
							coreAcceptedTests: sql<number>`count(case when ${userSubmissionTests.submissionStatus} = ${SubmissionStatus.CoreAccepted} then 1 end)`,
							successfulTests: sql<number>`count(case when ${userSubmissionTests.submissionStatus} = ${SubmissionStatus.Accepted} or ${userSubmissionTests.submissionStatus} = ${SubmissionStatus.CoreAccepted} then 1 end)`,
							failedTests: sql<number>`count(case when ${userSubmissionTests.submissionStatus} != ${SubmissionStatus.Accepted} and ${userSubmissionTests.submissionStatus} != ${SubmissionStatus.CoreAccepted} then 1 end)`,
							createdAt: userSubmissions.createdAt,
							updatedAt: userSubmissions.updatedAt,
						})
						.from(userSubmissions)
						.innerJoin(
							testBatches,
							eq(userSubmissions.testBatchId, testBatches.id),
						)
						.leftJoin(
							userSubmissionTests,
							eq(userSubmissions.id, userSubmissionTests.userSubmissionId),
						)
						.where(eq(userSubmissions.userId, userId))
						.groupBy(
							userSubmissions.id,
							userSubmissions.userId,
							userSubmissions.testBatchId,
							testBatches.name,
							userSubmissions.createdAt,
							userSubmissions.updatedAt,
						)
						.orderBy(userSubmissions.updatedAt);

					const submissions = await this.instrumentationService.startSpan(
						{
							name: query.toSQL().sql,
							op: "db.query",
							attributes: { "db.system": "postgres" },
						},
						() => query.execute(),
					);

					return submissions.map((submission) => ({
						id: submission.id,
						userId: submission.userId,
						testBatchId: submission.testBatchId,
						testBatchName: submission.testBatchName,
						totalTests: submission.totalTests,
						acceptedTests: submission.acceptedTests,
						coreAcceptedTests: submission.coreAcceptedTests,
						successfulTests: submission.successfulTests,
						failedTests: submission.failedTests,
						createdAt: submission.createdAt,
						updatedAt: submission.updatedAt,
					}));
				} catch (error) {
					this.crashReporterService.report(error);
					throw error;
				}
			},
		);
	}

	async updateUserSubmission(
		id: number,
		updates: { updatedAt: Date },
		tx?: Transaction,
	): Promise<UserSubmissionWithoutTests> {
		const invoker = tx ?? db;

		return await this.instrumentationService.startSpan(
			{ name: "UserSubmissionsRepository > updateUserSubmission" },
			async () => {
				try {
					const query = invoker
						.update(userSubmissions)
						.set(updates)
						.where(eq(userSubmissions.id, id))
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
						return {
							id: updated.id,
							userId: updated.userId,
							testBatchId: updated.testBatchId,
							createdAt: updated.createdAt,
							updatedAt: updated.updatedAt,
						};
					}

					throw new DatabaseOperationError("Cannot update user submission");
				} catch (err) {
					this.crashReporterService.report(err);
					throw err;
				}
			},
		);
	}

	async deleteUserSubmission(id: number, tx?: Transaction): Promise<void> {
		const invoker = tx ?? db;

		return await this.instrumentationService.startSpan(
			{ name: "UserSubmissionsRepository > deleteUserSubmission" },
			async () => {
				try {
					const query = invoker
						.delete(userSubmissions)
						.where(eq(userSubmissions.id, id));

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
					throw err;
				}
			},
		);
	}

	async deleteUserSubmissionsByTestBatchId(
		testBatchId: number,
		tx?: Transaction,
	): Promise<void> {
		const invoker = tx ?? db;

		return await this.instrumentationService.startSpan(
			{
				name: "UserSubmissionsRepository > deleteUserSubmissionsByTestBatchId",
			},
			async () => {
				try {
					const query = invoker
						.delete(userSubmissions)
						.where(eq(userSubmissions.testBatchId, testBatchId));

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
					throw err;
				}
			},
		);
	}
}
