import { z } from "zod";

export const fileSchema = z.object({
	id: z.number(),
	userId: z.string(),
	name: z.string(),
	type: z.enum(["file", "folder"]),
	content: z.string().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
	parentId: z.number().nullable(),
});

export type File = z.infer<typeof fileSchema>;
