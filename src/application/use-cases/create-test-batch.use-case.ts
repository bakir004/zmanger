import type { IInstrumentationService } from "~/application/services/instrumentation.service.interface";
import { InputParseError } from "~/entities/errors/common";
import type { TestBatch, TestBatchInsert } from "~/entities/models/test-batch";
import type { ITestBatchesRepository } from "../repositories/test-batches.repository.interface";
import type { Transaction } from "drizzle";

export type ICreateTestBatchUseCase = ReturnType<typeof createTestBatchUseCase>;

export const createTestBatchUseCase =
	(
		instrumentationService: IInstrumentationService,
		testBatchesRepository: ITestBatchesRepository,
	) =>
	(
		input: {
			testBatch: TestBatchInsert;
		},
		tx?: Transaction,
	): Promise<TestBatch> => {
		return instrumentationService.startSpan(
			{ name: "createTestBatchUseCase", op: "function" },
			async () => {
				// Authorization goes here

				const createdTestBatch = await testBatchesRepository.createTestBatch(
					input.testBatch,
					tx,
				);

				return {
					id: createdTestBatch.id,
					name: createdTestBatch.name,
					subject: createdTestBatch.subject,
					language: createdTestBatch.language,
					tests: [],
				};
			},
		);
	};
