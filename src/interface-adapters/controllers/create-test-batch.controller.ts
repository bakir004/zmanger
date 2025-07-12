import { z } from "zod";

const inputSchema = z.object({
	name: z.string(),
	subject: z.string(),
	language: z.string(),
	tests: z.array(
		z.object({
			code: z.object({
				topOfFile: z.string(),
				aboveMain: z.string(),
				main: z.string(),
			}),
			expectedOutput: z.array(z.string()),
			stdin: z.string(),
			hidden: z.boolean(),
		}),
	),
});

function presenter() {
	return {
		success: true,
		message: "Test batch created successfully",
	};
}

export type ICreateTestBatchController = ReturnType<
	typeof createTestBatchController
>;

export const createTestBatchController =
	() =>
	async (
		userId: string | undefined,
		input: Partial<z.infer<typeof inputSchema>>,
	): Promise<ReturnType<typeof presenter>> => {
		return presenter();
	};
