import type {
	ExecutionResult,
	SnakeCasedExecutionResult,
} from "~/entities/models/execution-result";
import type { ICodeJudgeService } from "~/application/services/code-judge.service.interface";
import type { Submission } from "~/entities/models/submission";
import type { IInstrumentationService } from "~/application/services/instrumentation.service.interface";
import type { ICrashReporterService } from "~/application/services/crash-reporter.service.interface";

export class CodeJudgeService implements ICodeJudgeService {
	constructor(
		private readonly instrumentationService: IInstrumentationService,
		private readonly crashReporterService: ICrashReporterService,
	) {}

	async judgeCode(submission: Submission): Promise<SnakeCasedExecutionResult> {
		return this.instrumentationService.startSpan(
			{ name: "CodeJudgeService > judgeCode" },
			async () => {
				try {
					const snakeCasedSubmission = {
						code: submission.code,
						stdin: submission.stdin,
						expected_output: submission.expectedOutputs,
						language_id: submission.languageId,
					};
					console.log(snakeCasedSubmission);
					const res = await fetch(
						`${process.env.CODE_RUNNER_URL}/submissions`,
						{
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify(snakeCasedSubmission),
						},
					);
					const contentType = res.headers.get("content-type");
					let result: SnakeCasedExecutionResult | undefined;
					if (contentType?.includes("application/json"))
						result = await res.json();
					else throw new Error(await res.text());

					if (!result) throw new Error("No result from code runner");

					return result;
				} catch (error) {
					this.crashReporterService.report(error);
					throw error;
				}
			},
		);
	}
}
