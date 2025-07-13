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
	testBatchId: z.number(),
});

export type Test = z.infer<typeof selectTestSchema>;

export const insertTestSchema = z.object({
	code: z.object({
		topOfFile: z.string(),
		aboveMain: z.string(),
		main: z.string(),
	}),
	expectedOutput: z.array(z.string()),
	stdin: z.string(),
	hidden: z.boolean(),
	testBatchId: z.number(),
});

export type TestInsert = z.infer<typeof insertTestSchema>;

export const flatTestSchema = z.object({
	id: z.number(),
	topOfFile: z.string(),
	aboveMain: z.string(),
	main: z.string(),
	stdin: z.string(),
	expectedOutput: z.array(z.string()),
	hidden: z.boolean(),
	testBatchId: z.number(),
});

export type FlatTest = z.infer<typeof flatTestSchema>;

export const insertFlatTestSchema = z.object({
	topOfFile: z.string(),
	aboveMain: z.string(),
	main: z.string(),
	stdin: z.string(),
	expectedOutput: z.array(z.string()),
	hidden: z.boolean(),
	testBatchId: z.number(),
});

export type FlatTestInsert = z.infer<typeof insertFlatTestSchema>;

export const testWithUserCodeAndLanguageSchema = z.object({
	test: selectTestSchema,
	userCode: z.string(),
	language: z.string(),
});

export type TestWithUserCodeAndLanguage = z.infer<
	typeof testWithUserCodeAndLanguageSchema
>;
