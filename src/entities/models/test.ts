import { z } from "zod";

export const selectTestSchema = z.object({
	id: z.number(),
	code: z.object({
		topOfFile: z.string(),
		aboveMain: z.string(),
		main: z.string(),
	}),
	expectedOutput: z.array(z.string()),
	stdin: z.string(),
	hidden: z.boolean(),
});

export type Test = z.infer<typeof selectTestSchema>;

export const insertTestSchema = z.object({
	topOfFile: z.string(),
	aboveMain: z.string(),
	main: z.string(),
	expectedOutput: z.array(z.string()),
	stdin: z.string(),
	hidden: z.boolean(),
	testBatchId: z.number(),
});

export type TestInsert = z.infer<typeof insertTestSchema>;
