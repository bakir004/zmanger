import type { IInstrumentationService } from "~/application/services/instrumentation.service.interface";
import type { ICreateTestUseCase } from "~/application/use-cases/tests/create-test.use-case";
import type { TestInsert } from "~/entities/models/test";
import { UnauthenticatedError } from "~/entities/errors/auth";
import { InputParseError } from "~/entities/errors/common";
import { z } from "zod";

const inputSchema = z.object({
	test: z.object({
		code: z.object({
			topOfFile: z.string(),
			aboveMain: z.string(),
			main: z.string(),
		}),
		stdin: z.string(),
		expectedOutput: z.array(z.string()),
		hidden: z.boolean(),
		testBatchId: z.number(),
	}),
});

export type ICreateTestController = ReturnType<typeof createTestController>;

export const createTestController =
	(
		instrumentationService: IInstrumentationService,
		createTestUseCase: ICreateTestUseCase,
	) =>
	async (
		userId: string | undefined,
		input: Partial<z.infer<typeof inputSchema>>,
	): Promise<void> => {
		return await instrumentationService.startSpan(
			{
				name: "createTestController",
			},
			async () => {
				if (!userId)
					throw new UnauthenticatedError("Must be logged in to create test");

				const { data, error: inputParseError } = inputSchema.safeParse(input);

				if (inputParseError) throw new InputParseError("Invalid input");

				const test: TestInsert = {
					code: data.test.code,
					stdin: data.test.stdin,
					expectedOutput: data.test.expectedOutput,
					hidden: data.test.hidden,
					testBatchId: data.test.testBatchId,
				};

				await createTestUseCase({ test });
			},
		);
	};
