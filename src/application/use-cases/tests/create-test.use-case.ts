import type { IInstrumentationService } from "~/application/services/instrumentation.service.interface";
import type { Test, TestInsert } from "~/entities/models/test";
import type { ITestsRepository } from "../../repositories/tests.repository.interface";
import type { Transaction } from "drizzle";

export type ICreateTestUseCase = ReturnType<typeof createTestUseCase>;

export const createTestUseCase =
	(
		instrumentationService: IInstrumentationService,
		testsRepository: ITestsRepository,
	) =>
	(
		input: {
			test: TestInsert;
		},
		tx?: Transaction,
	): Promise<Test> => {
		return instrumentationService.startSpan(
			{ name: "createTestUseCase", op: "function" },
			async () => {
				// Authorization goes here
				const createdTest = await testsRepository.createTest(input.test, tx);
				return createdTest;
			},
		);
	};
