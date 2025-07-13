import { z } from "zod";

// This EXACTLY matches the response from the API
// See https://github.com/bakir004/zmanger-rce/blob/master/src/models/execution.rs

export const executionResultSchema = z.object({
	compileOutput: z.string(),
	stdout: z.string(),
	stderr: z.string(),
	time: z.number(),
	runtimeStatus: z.number(),
	submissionStatus: z.number(),
	description: z.string(),
});

export type ExecutionResult = z.infer<typeof executionResultSchema>;

export const executionResultWithTestIdSchema = executionResultSchema.extend({
	testId: z.number(),
});

export type ExecutionResultWithTestId = z.infer<
	typeof executionResultWithTestIdSchema
>;

export type SnakeCasedExecutionResult = {
	compile_output: string;
	stdout: string;
	stderr: string;
	time: number;
	runtime_status: number;
	submission_status: number;
	description: string;
};
