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

export const DI_SYMBOLS = {
	// Services
	IInstrumentationService: Symbol.for("IInstrumentationService"),
	ICrashReporterService: Symbol.for("ICrashReporterService"),
	ITransactionManagerService: Symbol.for("ITransactionManagerService"),

	// Controllers
	ICreateTestBatchController: Symbol.for("ICreateTestBatchController"),
	IGetTestBatchesController: Symbol.for("IGetTestBatchesController"),

	// Repositories
	ITestBatchesRepository: Symbol.for("ITestBatchesRepository"),
	ITestsRepository: Symbol.for("ITestsRepository"),

	// Use Cases
	ICreateTestBatchUseCase: Symbol.for("ICreateTestBatchUseCase"),
	ICreateTestUseCase: Symbol.for("ICreateTestUseCase"),
	IGetTestBatchesUseCase: Symbol.for("IGetTestBatchesUseCase"),
};
export interface DI_RETURN_TYPES {
	// Services
	IInstrumentationService: IInstrumentationService;
	ICrashReporterService: ICrashReporterService;
	ITransactionManagerService: ITransactionManagerService;

	// Controllers
	ICreateTestBatchController: ICreateTestBatchController;
	IGetTestBatchesController: IGetTestBatchesController;

	// Repositories
	ITestBatchesRepository: ITestBatchesRepository;
	ITestsRepository: ITestsRepository;

	// Use Cases
	ICreateTestBatchUseCase: ICreateTestBatchUseCase;
	ICreateTestUseCase: ICreateTestUseCase;
	IGetTestBatchesUseCase: IGetTestBatchesUseCase;
}
