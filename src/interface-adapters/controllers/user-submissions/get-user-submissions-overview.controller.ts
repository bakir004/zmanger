import type { IInstrumentationService } from "~/application/services/instrumentation.service.interface";
import type { IGetUserSubmissionsOverviewUseCase } from "~/application/use-cases/user-submissions/get-user-submissions-overview.use-case";
import type { UserSubmissionOverview } from "~/entities/models/user-submission";
import { UnauthenticatedError } from "~/entities/errors/auth";

export type IGetUserSubmissionsOverviewController = ReturnType<
	typeof getUserSubmissionsOverviewController
>;

export const getUserSubmissionsOverviewController =
	(
		instrumentationService: IInstrumentationService,
		getUserSubmissionsOverviewUseCase: IGetUserSubmissionsOverviewUseCase,
	) =>
	async (userId: string | undefined): Promise<UserSubmissionOverview[]> => {
		return await instrumentationService.startSpan(
			{
				name: "getUserSubmissionsOverviewController",
			},
			async () => {
				if (!userId)
					throw new UnauthenticatedError(
						"Must be logged in to view submissions",
					);

				const submissions = await getUserSubmissionsOverviewUseCase({
					userId,
				});

				return submissions;
			},
		);
	};
