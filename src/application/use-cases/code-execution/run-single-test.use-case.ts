import type { IInstrumentationService } from "~/application/services/instrumentation.service.interface";
import type { TestWithUserCodeAndLanguage } from "~/entities/models/test";
import type { ICodeJudgeService } from "../../services/code-judge.service.interface";
import type {
	ExecutionResult,
	ExecutionResultWithTestId,
	SnakeCasedExecutionResult,
} from "~/entities/models/execution-result";
import type { ILanguageMapperService } from "../../services/language-mapper.service.interface";

export type IRunSingleTestUseCase = ReturnType<typeof runSingleTestUseCase>;

export const runSingleTestUseCase =
	(
		instrumentationService: IInstrumentationService,
		codeJudgeService: ICodeJudgeService,
		languageMapperService: ILanguageMapperService,
	) =>
	(input: {
		testWithUserCode: TestWithUserCodeAndLanguage;
	}): Promise<ExecutionResultWithTestId> => {
		return instrumentationService.startSpan(
			{ name: "runSingleTestUseCase", op: "function" },
			async () => {
				// Authorization goes here

				const languageId = languageMapperService.languageToId(
					input.testWithUserCode.language,
				);

				// Prefixing the users main function with an underscore
				const transformedCode = input.testWithUserCode.userCode.replace(
					/\b(int|void)\s+main\s*\(/g,
					(match: string) => match.replace(/\bmain\b/, "_main"),
				);

				const combinedCode = `${input.testWithUserCode.test.code.topOfFile}\n${transformedCode}\n${input.testWithUserCode.test.code.aboveMain}\nint main() {\n${input.testWithUserCode.test.code.main}\nreturn 0;\n}`;

				const submission = {
					code: combinedCode,
					stdin: input.testWithUserCode.test.stdin,
					expectedOutputs: input.testWithUserCode.test.expectedOutput,
					languageId,
				};

				const executionResult: SnakeCasedExecutionResult =
					await codeJudgeService.judgeCode(submission);

				const executionResultWithTestId: ExecutionResultWithTestId = {
					compileOutput: executionResult.compile_output,
					stdout: executionResult.stdout,
					stderr: executionResult.stderr,
					time: executionResult.time,
					runtimeStatus: executionResult.runtime_status,
					submissionStatus: executionResult.submission_status,
					description: executionResult.description,
					testId: input.testWithUserCode.test.id,
				};

				return executionResultWithTestId;
			},
		);
	};
