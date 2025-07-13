import type { IInstrumentationService } from "~/application/services/instrumentation.service.interface";
import type { ICrashReporterService } from "~/application/services/crash-reporter.service.interface";
import type { ICreateTestBatchController } from "~/interface-adapters/controllers/create-test-batch.controller";
import type { ITransactionManagerService } from "~/application/services/transaction-manager.service.interface";
import type { ITestBatchesRepository } from "~/application/repositories/test-batches.repository.interface";
import type { ICreateTestBatchUseCase } from "~/application/use-cases/create-test-batch.use-case";
import type { ITestsRepository } from "~/application/repositories/tests.repository.interface";
import type { ICreateTestUseCase } from "~/application/use-cases/create-test.use-case";
import type { IGetTestBatchesController } from "~/interface-adapters/controllers/get-test-batches.controller";
import type { IGetTestBatchesUseCase } from "~/application/use-cases/get-test-batches.use-case";
import type { IGetTestsByBatchIdController } from "~/interface-adapters/controllers/get-tests-by-batch-id.controller";
import type { IGetTestsByBatchIdUseCase } from "~/application/use-cases/get-tests-by-batch-id.use-case";
import type { ICodeJudgeService } from "~/application/services/code-judge.service.interface";
import type { IRunSingleTestUseCase } from "~/application/use-cases/run-single-test.use-case";
import type { ILanguageMapperService } from "~/application/services/language-mapper.service.interface";
import type { IRunSingleTestController } from "~/interface-adapters/controllers/run-single-test.controller";

export const DI_SYMBOLS = {
	// Services
	IInstrumentationService: Symbol.for("IInstrumentationService"),
	ICrashReporterService: Symbol.for("ICrashReporterService"),
	ITransactionManagerService: Symbol.for("ITransactionManagerService"),

	// Controllers
	ICreateTestBatchController: Symbol.for("ICreateTestBatchController"),
	IGetTestBatchesController: Symbol.for("IGetTestBatchesController"),
	IGetTestsByBatchIdController: Symbol.for("IGetTestsByBatchIdController"),
	IRunSingleTestController: Symbol.for("IRunSingleTestController"),

	// Repositories
	ITestBatchesRepository: Symbol.for("ITestBatchesRepository"),
	ITestsRepository: Symbol.for("ITestsRepository"),

	// Use Cases
	ICreateTestBatchUseCase: Symbol.for("ICreateTestBatchUseCase"),
	ICreateTestUseCase: Symbol.for("ICreateTestUseCase"),
	IGetTestBatchesUseCase: Symbol.for("IGetTestBatchesUseCase"),
	IGetTestsByBatchIdUseCase: Symbol.for("IGetTestsByBatchIdUseCase"),
	IRunSingleTestUseCase: Symbol.for("IRunSingleTestUseCase"),

	// External Services
	ILanguageMapperService: Symbol.for("ILanguageMapperService"),
	ICodeJudgeService: Symbol.for("ICodeJudgeService"),
};
export interface DI_RETURN_TYPES {
	// Services
	IInstrumentationService: IInstrumentationService;
	ICrashReporterService: ICrashReporterService;
	ITransactionManagerService: ITransactionManagerService;

	// Controllers
	ICreateTestBatchController: ICreateTestBatchController;
	IGetTestBatchesController: IGetTestBatchesController;
	IGetTestsByBatchIdController: IGetTestsByBatchIdController;
	IRunSingleTestController: IRunSingleTestController;

	// Repositories
	ITestBatchesRepository: ITestBatchesRepository;
	ITestsRepository: ITestsRepository;

	// Use Cases
	ICreateTestBatchUseCase: ICreateTestBatchUseCase;
	ICreateTestUseCase: ICreateTestUseCase;
	IGetTestBatchesUseCase: IGetTestBatchesUseCase;
	IGetTestsByBatchIdUseCase: IGetTestsByBatchIdUseCase;
	IRunSingleTestUseCase: IRunSingleTestUseCase;

	// External Services
	ILanguageMapperService: ILanguageMapperService;
	ICodeJudgeService: ICodeJudgeService;
}
