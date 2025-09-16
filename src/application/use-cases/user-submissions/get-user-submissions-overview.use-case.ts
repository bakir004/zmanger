import type { IInstrumentationService } from "~/application/services/instrumentation.service.interface";
import type { UserSubmissionOverview } from "~/entities/models/user-submission";
import type { IUserSubmissionsRepository } from "../../repositories/user-submissions.repository.interface";

export type IGetUserSubmissionsOverviewUseCase = ReturnType<
	typeof getUserSubmissionsOverviewUseCase
>;

export const getUserSubmissionsOverviewUseCase =
	(
		instrumentationService: IInstrumentationService,
		userSubmissionsRepository: IUserSubmissionsRepository,
	) =>
	(input: { userId: string }): Promise<UserSubmissionOverview[]> => {
		return instrumentationService.startSpan(
			{ name: "getUserSubmissionsOverviewUseCase", op: "function" },
			async () => {
				// Authorization goes here - user can only see their own submissions
				const submissions =
					await userSubmissionsRepository.getUserSubmissionsOverviewByUser(
						input.userId,
					);
				return submissions;
			},
		);
	};
