import { z } from "zod";
import { executionResultSchema } from "./execution-result";

export const userSubmissionTestSchema = z.object({
	id: z.number(),
	userSubmissionId: z.number(),
	testId: z.number(),
	compileOutput: z.string(),
	stdout: z.string(),
	stderr: z.string(),
	time: z.number(),
	runtimeStatus: z.number(),
	submissionStatus: z.number(),
	description: z.string(),
	createdAt: z.date(),
});

export type UserSubmissionTest = z.infer<typeof userSubmissionTestSchema>;

export const userSubmissionSchema = z.object({
	id: z.number(),
	userId: z.string(),
	testBatchId: z.number(),
	tests: z.array(userSubmissionTestSchema),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export type UserSubmission = z.infer<typeof userSubmissionSchema>;

export const userSubmissionWithoutTestsSchema = userSubmissionSchema.omit({
	tests: true,
});

export type UserSubmissionWithoutTests = z.infer<
	typeof userSubmissionWithoutTestsSchema
>;

export const insertUserSubmissionSchema = z.object({
	userId: z.string(),
	testBatchId: z.number(),
});

export type UserSubmissionInsert = z.infer<typeof insertUserSubmissionSchema>;

export const insertUserSubmissionTestSchema = z.object({
	userSubmissionId: z.number(),
	testId: z.number(),
	compileOutput: z.string(),
	stdout: z.string(),
	stderr: z.string(),
	time: z.number(),
	runtimeStatus: z.number(),
	submissionStatus: z.number(),
	description: z.string(),
});

export type UserSubmissionTestInsert = z.infer<
	typeof insertUserSubmissionTestSchema
>;

export const createUserSubmissionWithTestsSchema = z.object({
	userId: z.string(),
	testBatchId: z.number(),
	testResults: z.array(
		z.object({
			testId: z.number(),
			executionResult: executionResultSchema,
		}),
	),
});

export type CreateUserSubmissionWithTests = z.infer<
	typeof createUserSubmissionWithTestsSchema
>;

export const userSubmissionOverviewSchema = z.object({
	id: z.number(),
	userId: z.string(),
	testBatchId: z.number(),
	testBatchName: z.string(),
	totalTests: z.number(),
	acceptedTests: z.number(),
	coreAcceptedTests: z.number(),
	successfulTests: z.number(), // Status 0 or 1 for progress bar
	failedTests: z.number(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export type UserSubmissionOverview = z.infer<
	typeof userSubmissionOverviewSchema
>;
