import { createModule } from "@evyweb/ioctopus";

import { createTestBatchController } from "~/interface-adapters/controllers/create-test-batch.controller";

import { DI_SYMBOLS } from "di/types";
import { TestBatchesRepository } from "~/infrastructure/repositories/test-batches.repository";
import { createTestBatchUseCase } from "~/application/use-cases/create-test-batch.use-case";
import { TestsRepository } from "~/infrastructure/repositories/tests.repository";
import { createTestUseCase } from "~/application/use-cases/create-test.use-case";
import { getTestBatchesController } from "~/interface-adapters/controllers/get-test-batches.controller";
import { getTestBatchesUseCase } from "~/application/use-cases/get-test-batches.use-case";
import { getTestsByBatchIdController } from "~/interface-adapters/controllers/get-tests-by-batch-id.controller";
import { getTestsByBatchIdUseCase } from "~/application/use-cases/get-tests-by-batch-id.use-case";
import { runSingleTestUseCase } from "~/application/use-cases/run-single-test.use-case";

export function createTestsModule() {
	const testsModule = createModule();

	testsModule
		.bind(DI_SYMBOLS.ITestBatchesRepository)
		.toClass(TestBatchesRepository, [
			DI_SYMBOLS.IInstrumentationService,
			DI_SYMBOLS.ICrashReporterService,
		]);

	testsModule
		.bind(DI_SYMBOLS.ICreateTestBatchController)
		.toHigherOrderFunction(createTestBatchController, [
			DI_SYMBOLS.IInstrumentationService,
			DI_SYMBOLS.ITransactionManagerService,
			DI_SYMBOLS.ICreateTestBatchUseCase,
			DI_SYMBOLS.ICreateTestUseCase,
		]);

	testsModule
		.bind(DI_SYMBOLS.ICreateTestBatchUseCase)
		.toHigherOrderFunction(createTestBatchUseCase, [
			DI_SYMBOLS.IInstrumentationService,
			DI_SYMBOLS.ITestBatchesRepository,
		]);

	testsModule
		.bind(DI_SYMBOLS.ITestsRepository)
		.toClass(TestsRepository, [
			DI_SYMBOLS.IInstrumentationService,
			DI_SYMBOLS.ICrashReporterService,
		]);

	testsModule
		.bind(DI_SYMBOLS.ICreateTestUseCase)
		.toHigherOrderFunction(createTestUseCase, [
			DI_SYMBOLS.IInstrumentationService,
			DI_SYMBOLS.ITestsRepository,
		]);

	testsModule
		.bind(DI_SYMBOLS.IGetTestBatchesController)
		.toHigherOrderFunction(getTestBatchesController, [
			DI_SYMBOLS.IInstrumentationService,
			DI_SYMBOLS.IGetTestBatchesUseCase,
		]);

	testsModule
		.bind(DI_SYMBOLS.IGetTestBatchesUseCase)
		.toHigherOrderFunction(getTestBatchesUseCase, [
			DI_SYMBOLS.IInstrumentationService,
			DI_SYMBOLS.ITestBatchesRepository,
		]);

	testsModule
		.bind(DI_SYMBOLS.IGetTestsByBatchIdController)
		.toHigherOrderFunction(getTestsByBatchIdController, [
			DI_SYMBOLS.IInstrumentationService,
			DI_SYMBOLS.IGetTestsByBatchIdUseCase,
		]);

	testsModule
		.bind(DI_SYMBOLS.IGetTestsByBatchIdUseCase)
		.toHigherOrderFunction(getTestsByBatchIdUseCase, [
			DI_SYMBOLS.IInstrumentationService,
			DI_SYMBOLS.ITestsRepository,
		]);

	testsModule
		.bind(DI_SYMBOLS.IRunSingleTestUseCase)
		.toHigherOrderFunction(runSingleTestUseCase, [
			DI_SYMBOLS.IInstrumentationService,
			DI_SYMBOLS.ICodeJudgeService,
			DI_SYMBOLS.ILanguageMapperService,
		]);

	return testsModule;
}
