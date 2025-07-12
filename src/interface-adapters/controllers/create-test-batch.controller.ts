import { z } from "zod";
import type { IInstrumentationService } from "~/application/services/instrumentation.service.interface";

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
	console.log("ended with presenter");
	return {
		success: true,
		message: "Test batch created successfully",
	};
}

export type ICreateTestBatchController = ReturnType<
	typeof createTestBatchController
>;

export const createTestBatchController =
	(instrumentationService: IInstrumentationService) =>
	async (
		userId: string | undefined,
		input: Partial<z.infer<typeof inputSchema>>,
	): Promise<ReturnType<typeof presenter>> => {
		console.log("controller before instrumentation");
		return await instrumentationService.startSpan(
			{
				name: "createTestBatch Controller",
			},
			async () => {
				return presenter();
			},
		);
	};
