import { z } from "zod";
import { selectTestSchema } from "./test";

export const selectTestBatchSchema = z.object({
	id: z.number(),
	name: z.string(),
	subject: z.string(),
	language: z.string(),
	tests: z.array(selectTestSchema),
});

export type SelectTestBatch = z.infer<typeof selectTestBatchSchema>;

export const insertTestBatchSchema = z.object({
	name: z.string(),
	subject: z.string(),
	language: z.string(),
});

export type InsertTestBatch = z.infer<typeof insertTestBatchSchema>;
