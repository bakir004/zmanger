import { z } from "zod";
import { selectTestSchema } from "./test";

export const selectTestBatchSchema = z.object({
	id: z.number(),
	name: z.string(),
	subject: z.string(),
	language: z.string(),
	tests: z.array(selectTestSchema),
	public: z.boolean(),
});

export type TestBatch = z.infer<typeof selectTestBatchSchema>;
export type TestBatchWithoutTests = Omit<TestBatch, "tests">;

export const insertTestBatchSchema = z.object({
	name: z.string(),
	subject: z.string(),
	language: z.string(),
});

export type TestBatchInsert = z.infer<typeof insertTestBatchSchema>;

export const updateTestBatchSchema = z.object({
	name: z.string().optional(),
	subject: z.string().optional(),
	language: z.string().optional(),
	public: z.boolean().optional(),
});

export type TestBatchUpdate = z.infer<typeof updateTestBatchSchema>;
