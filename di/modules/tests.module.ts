import { createModule } from "@evyweb/ioctopus";

import { createTestBatchController } from "~/interface-adapters/controllers/create-test-batch.controller";

import { DI_SYMBOLS } from "di/types";
import { InstrumentationService } from "~/infrastructure/services/instrumentation.service";
import { TestBatchesRepository } from "~/infrastructure/repositories/test-batches.repository";
import { createTestBatchUseCase } from "~/application/use-cases/create-test-batch.use-case";
import { TestsRepository } from "~/infrastructure/repositories/tests.repository";
import { createTestUseCase } from "~/application/use-cases/create-test.use-case";

export function createTestsModule() {
	const testsModule = createModule();

	// BINDANJE KONTROLERA I USE CASEOVA
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

	return testsModule;
}
