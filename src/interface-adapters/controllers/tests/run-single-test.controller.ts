import type { z } from "zod";
import { UnauthenticatedError } from "~/entities/errors/auth";
import { InputParseError } from "~/entities/errors/common";
import type { IInstrumentationService } from "~/application/services/instrumentation.service.interface";
import { testWithUserCodeAndLanguageSchema } from "~/entities/models/test";
import type { IRunSingleTestUseCase } from "~/application/use-cases/code-execution/run-single-test.use-case";
import type {
	ExecutionResult,
	ExecutionResultWithTestId,
} from "~/entities/models/execution-result";

const inputSchema = testWithUserCodeAndLanguageSchema;

export type IRunSingleTestController = ReturnType<
	typeof runSingleTestController
>;

export const runSingleTestController =
	(
		instrumentationService: IInstrumentationService,
		runSingleTestUseCase: IRunSingleTestUseCase,
	) =>
	async (
		userId: string | undefined,
		input: Partial<z.infer<typeof inputSchema>>,
	): Promise<ExecutionResultWithTestId> => {
		return await instrumentationService.startSpan(
			{
				name: "runSingleTestController",
			},
			async () => {
				if (!userId)
					throw new UnauthenticatedError("Must be logged in to run tests");

				const { data, error: inputParseError } = inputSchema.safeParse(input);

				if (inputParseError) {
					throw new InputParseError("Invalid input");
				}

				return await instrumentationService.startSpan(
					{ name: "runSingleTestController > runSingleTestUseCase" },
					async () => {
						const res = await runSingleTestUseCase({
							testWithUserCode: data,
						});
						return res;
					},
				);
			},
		);
	};
