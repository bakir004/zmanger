import { z } from "zod";
import { UnauthenticatedError } from "~/entities/errors/auth";
import { InputParseError } from "~/entities/errors/common";
import type { IInstrumentationService } from "~/application/services/instrumentation.service.interface";
import type { ITransactionManagerService } from "~/application/services/transaction-manager.service.interface";
import type { ICreateTestBatchUseCase } from "~/application/use-cases/create-test-batch.use-case";
import type { ICreateTestUseCase } from "~/application/use-cases/create-test.use-case";
import type { Transaction } from "drizzle";
import type { ITransaction } from "~/entities/models/transaction.interface";

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
	console.log("presenter");
	return {
		success: true,
		message: "Test batch created successfully",
	};
}

export type ICreateTestBatchController = ReturnType<
	typeof createTestBatchController
>;

export const createTestBatchController =
	(
		instrumentationService: IInstrumentationService,
		transactionManagerService: ITransactionManagerService,
		createTestBatchUseCase: ICreateTestBatchUseCase,
		createTestUseCase: ICreateTestUseCase,
	) =>
	async (
		userId: string | undefined,
		input: Partial<z.infer<typeof inputSchema>>,
	): Promise<ReturnType<typeof presenter>> => {
		return await instrumentationService.startSpan(
			{
				name: "createTestBatchController",
			},
			async () => {
				if (!userId)
					throw new UnauthenticatedError("Must be logged in to create tests");

				const { data, error: inputParseError } = inputSchema.safeParse(input);

				if (inputParseError) {
					throw new InputParseError("Invalid input");
				}

				const testBatch = {
					name: data.name,
					subject: data.subject,
					language: data.language,
				};

				const tests = data.tests;

				await instrumentationService.startSpan(
					{ name: "Create test batch transaction" },
					async () => {
						return await transactionManagerService.startTransaction(
							async (tx: Transaction) => {
								try {
									const createdTestBatch = await createTestBatchUseCase(
										{
											testBatch,
										},
										tx,
									);

									await Promise.all(
										tests.map((test) =>
											createTestUseCase(
												{
													test: {
														...test,
														testBatchId: createdTestBatch.id,
													},
												},
												tx,
											),
										),
									);

									return createdTestBatch;
								} catch (error) {
									console.error("Rolling back!");
									tx.rollback();
								}
							},
						);
					},
				);

				return presenter();
			},
		);
	};
