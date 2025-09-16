import type { IInstrumentationService } from "~/application/services/instrumentation.service.interface";
import type { ICreateUserSubmissionUseCase } from "~/application/use-cases/user-submissions/create-user-submission.use-case";
import type { UserSubmission } from "~/entities/models/user-submission";
import { UnauthenticatedError } from "~/entities/errors/auth";
import { InputParseError } from "~/entities/errors/common";
import { z } from "zod";
import { executionResultSchema } from "~/entities/models/execution-result";

const inputSchema = z.object({
	testBatchId: z.number(),
	testResults: z.array(
		z.object({
			testId: z.number(),
			executionResult: executionResultSchema,
		}),
	),
});

export type ICreateUserSubmissionController = ReturnType<
	typeof createUserSubmissionController
>;

export const createUserSubmissionController =
	(
		instrumentationService: IInstrumentationService,
		createUserSubmissionUseCase: ICreateUserSubmissionUseCase,
	) =>
	async (
		userId: string | undefined,
		input: Partial<z.infer<typeof inputSchema>>,
	): Promise<UserSubmission> => {
		return await instrumentationService.startSpan(
			{
				name: "createUserSubmissionController",
			},
			async () => {
				if (!userId)
					throw new UnauthenticatedError(
						"Must be logged in to create user submission",
					);

				const { data, error: inputParseError } = inputSchema.safeParse(input);

				if (inputParseError) throw new InputParseError("Invalid input");

				const submission = await createUserSubmissionUseCase({
					userId,
					testBatchId: data.testBatchId,
					testResults: data.testResults,
				});

				return submission;
			},
		);
	};
