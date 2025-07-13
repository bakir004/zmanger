import type { SnakeCasedExecutionResult } from "~/entities/models/execution-result";
import type { Submission } from "~/entities/models/submission";

export interface ICodeJudgeService {
	judgeCode(submission: Submission): Promise<SnakeCasedExecutionResult>;
}
