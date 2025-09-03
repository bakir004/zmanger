import { createModule } from "@evyweb/ioctopus";

import { createTestBatchController } from "~/interface-adapters/controllers/tests/create-test-batch.controller";
import { createTestController } from "~/interface-adapters/controllers/tests/create-test.controller";
import { updateTestBatchController } from "~/interface-adapters/controllers/tests/update-test-batch.controller";
import { updateTestController } from "~/interface-adapters/controllers/tests/update-test.controller";
import { deleteTestController } from "~/interface-adapters/controllers/tests/delete-test.controller";
import { deleteTestBatchController } from "~/interface-adapters/controllers/tests/delete-test-batch.controller";

import { DI_SYMBOLS } from "di/types";
import { TestBatchesRepository } from "~/infrastructure/repositories/test-batches.repository";
import { TestsRepository } from "~/infrastructure/repositories/tests.repository";
import { createTestBatchUseCase } from "~/application/use-cases/tests/create-test-batch.use-case";
import { updateTestBatchUseCase } from "~/application/use-cases/tests/update-test-batch.use-case";
import { updateTestUseCase } from "~/application/use-cases/tests/update-test.use-case";
import { deleteTestUseCase } from "~/application/use-cases/tests/delete-test.use-case";
import { deleteTestBatchUseCase } from "~/application/use-cases/tests/delete-test-batch.use-case";
import { createTestUseCase } from "~/application/use-cases/tests/create-test.use-case";
import { getTestBatchesController } from "~/interface-adapters/controllers/tests/get-test-batches.controller";
import { getTestBatchesUseCase } from "~/application/use-cases/tests/get-test-batches.use-case";
import { getTestsByBatchIdController } from "~/interface-adapters/controllers/tests/get-tests-by-batch-id.controller";
import { getTestsByBatchIdUseCase } from "~/application/use-cases/tests/get-tests-by-batch-id.use-case";
import { runSingleTestUseCase } from "~/application/use-cases/code-execution/run-single-test.use-case";

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
		.bind(DI_SYMBOLS.ICreateTestController)
		.toHigherOrderFunction(createTestController, [
			DI_SYMBOLS.IInstrumentationService,
			DI_SYMBOLS.ICreateTestUseCase,
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

	// Update test batch bindings
	testsModule
		.bind(DI_SYMBOLS.IUpdateTestBatchController)
		.toHigherOrderFunction(updateTestBatchController, [
			DI_SYMBOLS.IInstrumentationService,
			DI_SYMBOLS.IUpdateTestBatchUseCase,
		]);

	testsModule
		.bind(DI_SYMBOLS.IUpdateTestBatchUseCase)
		.toHigherOrderFunction(updateTestBatchUseCase, [
			DI_SYMBOLS.ITestBatchesRepository,
		]);

	// Update test bindings
	testsModule
		.bind(DI_SYMBOLS.IUpdateTestController)
		.toHigherOrderFunction(updateTestController, [
			DI_SYMBOLS.IInstrumentationService,
			DI_SYMBOLS.IUpdateTestUseCase,
		]);

	testsModule
		.bind(DI_SYMBOLS.IUpdateTestUseCase)
		.toHigherOrderFunction(updateTestUseCase, [DI_SYMBOLS.ITestsRepository]);

	// Delete test bindings
	testsModule
		.bind(DI_SYMBOLS.IDeleteTestController)
		.toHigherOrderFunction(deleteTestController, [
			DI_SYMBOLS.IInstrumentationService,
			DI_SYMBOLS.IDeleteTestUseCase,
		]);

	testsModule
		.bind(DI_SYMBOLS.IDeleteTestUseCase)
		.toHigherOrderFunction(deleteTestUseCase, [DI_SYMBOLS.ITestsRepository]);

	// Delete test batch bindings
	testsModule
		.bind(DI_SYMBOLS.IDeleteTestBatchController)
		.toHigherOrderFunction(deleteTestBatchController, [
			DI_SYMBOLS.IInstrumentationService,
			DI_SYMBOLS.IDeleteTestBatchUseCase,
		]);

	testsModule
		.bind(DI_SYMBOLS.IDeleteTestBatchUseCase)
		.toHigherOrderFunction(deleteTestBatchUseCase, [
			DI_SYMBOLS.IInstrumentationService,
			DI_SYMBOLS.ITestBatchesRepository,
		]);

	return testsModule;
}
