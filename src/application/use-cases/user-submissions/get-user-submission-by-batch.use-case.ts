import type { IInstrumentationService } from "~/application/services/instrumentation.service.interface";
import type { UserSubmission } from "~/entities/models/user-submission";
import type { IUserSubmissionsRepository } from "../../repositories/user-submissions.repository.interface";

export type IGetUserSubmissionByBatchUseCase = ReturnType<
	typeof getUserSubmissionByBatchUseCase
>;

export const getUserSubmissionByBatchUseCase =
	(
		instrumentationService: IInstrumentationService,
		userSubmissionsRepository: IUserSubmissionsRepository,
	) =>
	(input: {
		userId: string;
		testBatchId: number;
	}): Promise<UserSubmission | null> => {
		return instrumentationService.startSpan(
			{ name: "getUserSubmissionByBatchUseCase", op: "function" },
			async () => {
				// Authorization goes here - user can only see their own submissions
				const submission =
					await userSubmissionsRepository.getUserSubmissionByUserAndBatch(
						input.userId,
						input.testBatchId,
					);
				return submission;
			},
		);
	};
