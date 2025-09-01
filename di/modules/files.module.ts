import { createModule } from "@evyweb/ioctopus";

import { DI_SYMBOLS } from "di/types";
import { FilesRepository } from "~/infrastructure/repositories/files.repository";
import { getFilesForUserController } from "~/interface-adapters/controllers/files/get-files-for-user.controller";
import { getFilesForUserUseCase } from "~/application/use-cases/files/get-files-for-user.use-case";
import { getFileContentController } from "~/interface-adapters/controllers/files/get-file-content.controller";
import { getFileContentUseCase } from "~/application/use-cases/files/get-file-content.use-case";
import { updateFileContentController } from "~/interface-adapters/controllers/files/update-file-content.controller";
import { updateFileContentUseCase } from "~/application/use-cases/files/update-file-content.use-case";
import { createFileController } from "~/interface-adapters/controllers/files/create-file.controller";
import { createFileUseCase } from "~/application/use-cases/files/create-file.use-case";
import { deleteFileController } from "~/interface-adapters/controllers/files/delete-file.controller";
import { deleteFileUseCase } from "~/application/use-cases/files/delete-file.use-case";
import { renameFileController } from "~/interface-adapters/controllers/files/rename-file.controller";
import { renameFileUseCase } from "~/application/use-cases/files/rename-file.use-case";
import { moveFileController } from "~/interface-adapters/controllers/files/move-file.controller";
import { moveFileUseCase } from "~/application/use-cases/files/move-file.use-case";

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

	filesModule
		.bind(DI_SYMBOLS.IGetFileContentController)
		.toHigherOrderFunction(getFileContentController, [
			DI_SYMBOLS.IInstrumentationService,
			DI_SYMBOLS.IGetFileContentUseCase,
		]);

	filesModule
		.bind(DI_SYMBOLS.IGetFileContentUseCase)
		.toHigherOrderFunction(getFileContentUseCase, [
			DI_SYMBOLS.IInstrumentationService,
			DI_SYMBOLS.IFilesRepository,
		]);

	filesModule
		.bind(DI_SYMBOLS.IUpdateFileContentController)
		.toHigherOrderFunction(updateFileContentController, [
			DI_SYMBOLS.IInstrumentationService,
			DI_SYMBOLS.IUpdateFileContentUseCase,
		]);

	filesModule
		.bind(DI_SYMBOLS.IUpdateFileContentUseCase)
		.toHigherOrderFunction(updateFileContentUseCase, [
			DI_SYMBOLS.IInstrumentationService,
			DI_SYMBOLS.IFilesRepository,
		]);

	filesModule
		.bind(DI_SYMBOLS.ICreateFileController)
		.toHigherOrderFunction(createFileController, [
			DI_SYMBOLS.IInstrumentationService,
			DI_SYMBOLS.ICreateFileUseCase,
		]);

	filesModule
		.bind(DI_SYMBOLS.ICreateFileUseCase)
		.toHigherOrderFunction(createFileUseCase, [
			DI_SYMBOLS.IInstrumentationService,
			DI_SYMBOLS.IFilesRepository,
		]);

	filesModule
		.bind(DI_SYMBOLS.IDeleteFileController)
		.toHigherOrderFunction(deleteFileController, [
			DI_SYMBOLS.IInstrumentationService,
			DI_SYMBOLS.IDeleteFileUseCase,
		]);

	filesModule
		.bind(DI_SYMBOLS.IDeleteFileUseCase)
		.toHigherOrderFunction(deleteFileUseCase, [
			DI_SYMBOLS.IInstrumentationService,
			DI_SYMBOLS.IFilesRepository,
		]);

	filesModule
		.bind(DI_SYMBOLS.IRenameFileController)
		.toHigherOrderFunction(renameFileController, [
			DI_SYMBOLS.IInstrumentationService,
			DI_SYMBOLS.IRenameFileUseCase,
		]);

	filesModule
		.bind(DI_SYMBOLS.IRenameFileUseCase)
		.toHigherOrderFunction(renameFileUseCase, [
			DI_SYMBOLS.IInstrumentationService,
			DI_SYMBOLS.IFilesRepository,
		]);

	filesModule
		.bind(DI_SYMBOLS.IMoveFileController)
		.toHigherOrderFunction(moveFileController, [
			DI_SYMBOLS.IInstrumentationService,
			DI_SYMBOLS.IMoveFileUseCase,
		]);

	filesModule
		.bind(DI_SYMBOLS.IMoveFileUseCase)
		.toHigherOrderFunction(moveFileUseCase, [
			DI_SYMBOLS.IInstrumentationService,
			DI_SYMBOLS.IFilesRepository,
		]);

	return filesModule;
}
