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
import type { IClerkService } from "~/application/services/clerk.service.interface";
import type { IRunSingleTestController } from "~/interface-adapters/controllers/tests/run-single-test.controller";
import type { IGetFilesForUserUseCase } from "~/application/use-cases/files/get-files-for-user.use-case";
import type { IGetFilesForUserController } from "~/interface-adapters/controllers/files/get-files-for-user.controller";
import type { IFilesRepository } from "~/application/repositories/files.repository.interface";
import type { IGetFileContentController } from "~/interface-adapters/controllers/files/get-file-content.controller";
import type { IGetFileContentUseCase } from "~/application/use-cases/files/get-file-content.use-case";
import type { IUpdateFileContentController } from "~/interface-adapters/controllers/files/update-file-content.controller";
import type { IUpdateFileContentUseCase } from "~/application/use-cases/files/update-file-content.use-case";
import type { ICreateFileController } from "~/interface-adapters/controllers/files/create-file.controller";
import type { ICreateFileUseCase } from "~/application/use-cases/files/create-file.use-case";
import type { IDeleteFileController } from "~/interface-adapters/controllers/files/delete-file.controller";
import type { IDeleteFileUseCase } from "~/application/use-cases/files/delete-file.use-case";
import type { IRenameFileController } from "~/interface-adapters/controllers/files/rename-file.controller";
import type { IRenameFileUseCase } from "~/application/use-cases/files/rename-file.use-case";
import type { IMoveFileController } from "~/interface-adapters/controllers/files/move-file.controller";
import type { IMoveFileUseCase } from "~/application/use-cases/files/move-file.use-case";
import type { IGetUsersFromClerkController } from "~/interface-adapters/controllers/users/get-users-from-clerk.controller";
import type { IGetUsersFromClerkUseCase } from "~/application/use-cases/users/get-users-from-clerk.use-case";
import type { IUpdateUserRoleController } from "~/interface-adapters/controllers/users/update-user-role.controller";
import type { IUpdateUserRoleUseCase } from "~/application/use-cases/users/update-user-role.use-case";
import type { IUpdateUserPlanController } from "~/interface-adapters/controllers/users/update-user-plan.controller";
import type { IUpdateUserPlanUseCase } from "~/application/use-cases/users/update-user-plan.use-case";

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
	IGetFileContentController: Symbol.for("IGetFileContentController"),
	IUpdateFileContentController: Symbol.for("IUpdateFileContentController"),
	ICreateFileController: Symbol.for("ICreateFileController"),
	IDeleteFileController: Symbol.for("IDeleteFileController"),
	IRenameFileController: Symbol.for("IRenameFileController"),
	IMoveFileController: Symbol.for("IMoveFileController"),
	IGetUsersFromClerkController: Symbol.for("IGetUsersFromClerkController"),
	IUpdateUserRoleController: Symbol.for("IUpdateUserRoleController"),
	IUpdateUserPlanController: Symbol.for("IUpdateUserPlanController"),

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
	IGetFileContentUseCase: Symbol.for("IGetFileContentUseCase"),
	IUpdateFileContentUseCase: Symbol.for("IUpdateFileContentUseCase"),
	ICreateFileUseCase: Symbol.for("ICreateFileUseCase"),
	IDeleteFileUseCase: Symbol.for("IDeleteFileUseCase"),
	IRenameFileUseCase: Symbol.for("IRenameFileUseCase"),
	IMoveFileUseCase: Symbol.for("IMoveFileUseCase"),
	IGetUsersFromClerkUseCase: Symbol.for("IGetUsersFromClerkUseCase"),
	IUpdateUserRoleUseCase: Symbol.for("IUpdateUserRoleUseCase"),
	IUpdateUserPlanUseCase: Symbol.for("IUpdateUserPlanUseCase"),

	// External Services
	ILanguageMapperService: Symbol.for("ILanguageMapperService"),
	ICodeJudgeService: Symbol.for("ICodeJudgeService"),
	IClerkService: Symbol.for("IClerkService"),
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
	IGetFileContentController: IGetFileContentController;
	IUpdateFileContentController: IUpdateFileContentController;
	ICreateFileController: ICreateFileController;
	IDeleteFileController: IDeleteFileController;
	IRenameFileController: IRenameFileController;
	IMoveFileController: IMoveFileController;
	IGetUsersFromClerkController: IGetUsersFromClerkController;
	IUpdateUserRoleController: IUpdateUserRoleController;
	IUpdateUserPlanController: IUpdateUserPlanController;

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
	IGetFileContentUseCase: IGetFileContentUseCase;
	IUpdateFileContentUseCase: IUpdateFileContentUseCase;
	ICreateFileUseCase: ICreateFileUseCase;
	IDeleteFileUseCase: IDeleteFileUseCase;
	IRenameFileUseCase: IRenameFileUseCase;
	IMoveFileUseCase: IMoveFileUseCase;
	IGetUsersFromClerkUseCase: IGetUsersFromClerkUseCase;
	IUpdateUserRoleUseCase: IUpdateUserRoleUseCase;
	IUpdateUserPlanUseCase: IUpdateUserPlanUseCase;

	// External Services
	ILanguageMapperService: ILanguageMapperService;
	ICodeJudgeService: ICodeJudgeService;
	IClerkService: IClerkService;
}
