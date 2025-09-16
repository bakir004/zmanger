import type { IInstrumentationService } from "~/application/services/instrumentation.service.interface";
import type { IGetUserSubmissionByBatchUseCase } from "~/application/use-cases/user-submissions/get-user-submission-by-batch.use-case";
import type { UserSubmission } from "~/entities/models/user-submission";
import { UnauthenticatedError } from "~/entities/errors/auth";
import { InputParseError } from "~/entities/errors/common";
import { z } from "zod";

const inputSchema = z.object({
	testBatchId: z.number(),
});

export type IGetUserSubmissionByBatchController = ReturnType<
	typeof getUserSubmissionByBatchController
>;

export const getUserSubmissionByBatchController =
	(
		instrumentationService: IInstrumentationService,
		getUserSubmissionByBatchUseCase: IGetUserSubmissionByBatchUseCase,
	) =>
	async (
		userId: string | undefined,
		input: Partial<z.infer<typeof inputSchema>>,
	): Promise<UserSubmission | null> => {
		return await instrumentationService.startSpan(
			{
				name: "getUserSubmissionByBatchController",
			},
			async () => {
				if (!userId)
					throw new UnauthenticatedError(
						"Must be logged in to view submission",
					);

				const { data, error: inputParseError } = inputSchema.safeParse(input);

				if (inputParseError) throw new InputParseError("Invalid input");

				const submission = await getUserSubmissionByBatchUseCase({
					userId,
					testBatchId: data.testBatchId,
				});

				return submission;
			},
		);
	};
