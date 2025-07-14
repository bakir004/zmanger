import type { IInstrumentationService } from "~/application/services/instrumentation.service.interface";
import type { ICrashReporterService } from "~/application/services/crash-reporter.service.interface";
import type { ICreateTestBatchController } from "~/interface-adapters/controllers/tests/create-test-batch.controller";
import type { ITransactionManagerService } from "~/application/services/transaction-manager.service.interface";
import type { ITestBatchesRepository } from "~/application/repositories/test-batches.repository.interface";
import type { ICreateTestBatchUseCase } from "~/application/use-cases/tests/create-test-batch.use-case";
import type { ITestsRepository } from "~/application/repositories/tests.repository.interface";
import type { ICreateTestUseCase } from "~/application/use-cases/tests/create-test.use-case";
import type { IGetTestBatchesController } from "~/interface-adapters/controllers/tests/get-test-batches.controller";
import type { IGetTestBatchesUseCase } from "~/application/use-cases/tests/get-test-batches.use-case";
import type { IGetTestsByBatchIdController } from "~/interface-adapters/controllers/tests/get-tests-by-batch-id.controller";
import type { IGetTestsByBatchIdUseCase } from "~/application/use-cases/tests/get-tests-by-batch-id.use-case";
import type { ICodeJudgeService } from "~/application/services/code-judge.service.interface";
import type { IRunSingleTestUseCase } from "~/application/use-cases/code-execution/run-single-test.use-case";
import type { ILanguageMapperService } from "~/application/services/language-mapper.service.interface";
import type { IRunSingleTestController } from "~/interface-adapters/controllers/tests/run-single-test.controller";
import type { IGetFilesForUserUseCase } from "~/application/use-cases/files/get-files-for-user.use-case";
import type { IGetFilesForUserController } from "~/interface-adapters/controllers/files/get-files-for-user.controller";
import type { IFilesRepository } from "~/application/repositories/files.repository.interface";

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
	IGetFilesForUserController: Symbol.for("IGetFilesForUserController"),

	// Repositories
	ITestBatchesRepository: Symbol.for("ITestBatchesRepository"),
	ITestsRepository: Symbol.for("ITestsRepository"),
	IFilesRepository: Symbol.for("IFilesRepository"),

	// Use Cases
	ICreateTestBatchUseCase: Symbol.for("ICreateTestBatchUseCase"),
	ICreateTestUseCase: Symbol.for("ICreateTestUseCase"),
	IGetTestBatchesUseCase: Symbol.for("IGetTestBatchesUseCase"),
	IGetTestsByBatchIdUseCase: Symbol.for("IGetTestsByBatchIdUseCase"),
	IRunSingleTestUseCase: Symbol.for("IRunSingleTestUseCase"),
	IGetFilesForUserUseCase: Symbol.for("IGetFilesForUserUseCase"),

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
	IGetFilesForUserController: IGetFilesForUserController;

	// Repositories
	ITestBatchesRepository: ITestBatchesRepository;
	ITestsRepository: ITestsRepository;
	IFilesRepository: IFilesRepository;

	// Use Cases
	ICreateTestBatchUseCase: ICreateTestBatchUseCase;
	ICreateTestUseCase: ICreateTestUseCase;
	IGetTestBatchesUseCase: IGetTestBatchesUseCase;
	IGetTestsByBatchIdUseCase: IGetTestsByBatchIdUseCase;
	IRunSingleTestUseCase: IRunSingleTestUseCase;
	IGetFilesForUserUseCase: IGetFilesForUserUseCase;

	// External Services
	ILanguageMapperService: ILanguageMapperService;
	ICodeJudgeService: ICodeJudgeService;
}
