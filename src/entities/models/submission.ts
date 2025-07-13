import { z } from "zod";

// This EXACTLY matches the request body in the API
// See https://github.com/bakir004/zmanger-rce/blob/master/src/models/submission.rs

export const submissionSchema = z.object({
	code: z.string(),
	stdin: z.string(),
	expectedOutputs: z.array(z.string()),
	languageId: z.number(),
});

export type Submission = z.infer<typeof submissionSchema>;
