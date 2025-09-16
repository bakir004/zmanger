import type { IInstrumentationService } from "~/application/services/instrumentation.service.interface";
import type { ITransactionManagerService } from "~/application/services/transaction-manager.service.interface";
import type {
	UserSubmission,
	CreateUserSubmissionWithTests,
} from "~/entities/models/user-submission";
import type { IUserSubmissionsRepository } from "../../repositories/user-submissions.repository.interface";

export type ICreateUserSubmissionUseCase = ReturnType<
	typeof createUserSubmissionUseCase
>;

export const createUserSubmissionUseCase =
	(
		instrumentationService: IInstrumentationService,
		transactionManagerService: ITransactionManagerService,
		userSubmissionsRepository: IUserSubmissionsRepository,
	) =>
	(input: CreateUserSubmissionWithTests): Promise<UserSubmission> => {
		return instrumentationService.startSpan(
			{ name: "createUserSubmissionUseCase", op: "function" },
			async () => {
				return await transactionManagerService.startTransaction(async (tx) => {
					// Check if user already has a submission for this test batch
					const existingSubmission =
						await userSubmissionsRepository.getUserSubmissionByUserAndBatch(
							input.userId,
							input.testBatchId,
						);

					// If existing submission exists, delete it (cascade will delete test results)
					if (existingSubmission) {
						await userSubmissionsRepository.deleteUserSubmission(
							existingSubmission.id,
							tx,
						);
					}

					// Create new submission
					const newSubmission =
						await userSubmissionsRepository.createUserSubmission(
							{
								userId: input.userId,
								testBatchId: input.testBatchId,
							},
							tx,
						);

					// Create test results
					const testResults = await Promise.all(
						input.testResults.map(async (testResult) => {
							return await userSubmissionsRepository.createUserSubmissionTest(
								{
									userSubmissionId: newSubmission.id,
									testId: testResult.testId,
									compileOutput: testResult.executionResult.compileOutput,
									stdout: testResult.executionResult.stdout,
									stderr: testResult.executionResult.stderr,
									time: testResult.executionResult.time,
									runtimeStatus: testResult.executionResult.runtimeStatus,
									submissionStatus: testResult.executionResult.submissionStatus,
									description: testResult.executionResult.description,
								},
								tx,
							);
						}),
					);

					return {
						...newSubmission,
						tests: testResults,
					};
				});
			},
		);
	};
