import { createModule } from "@evyweb/ioctopus";

import { TransactionManagerService } from "src/infrastructure/services/transaction-manager.service";

import { DI_SYMBOLS } from "di/types";
import { FilesRepository } from "~/infrastructure/repositories/files.repository";
import { getFilesForUserController } from "~/interface-adapters/controllers/files/get-files-for-user.controller";
import { getFilesForUserUseCase } from "~/application/use-cases/files/get-files-for-user.use-case";

export function createFilesModule() {
	const filesModule = createModule();

	filesModule
		.bind(DI_SYMBOLS.IFilesRepository)
		.toClass(FilesRepository, [
			DI_SYMBOLS.IInstrumentationService,
			DI_SYMBOLS.ICrashReporterService,
		]);

	filesModule
		.bind(DI_SYMBOLS.IGetFilesForUserController)
		.toHigherOrderFunction(getFilesForUserController, [
			DI_SYMBOLS.IInstrumentationService,
			DI_SYMBOLS.IGetFilesForUserUseCase,
		]);

	filesModule
		.bind(DI_SYMBOLS.IGetFilesForUserUseCase)
		.toHigherOrderFunction(getFilesForUserUseCase, [
			DI_SYMBOLS.IInstrumentationService,
			DI_SYMBOLS.IFilesRepository,
		]);

	return filesModule;
}
