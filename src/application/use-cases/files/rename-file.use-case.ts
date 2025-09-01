import type { IInstrumentationService } from "~/application/services/instrumentation.service.interface";
import type { IFilesRepository } from "../../repositories/files.repository.interface";

export type IRenameFileUseCase = ReturnType<typeof renameFileUseCase>;

export const renameFileUseCase =
	(
		instrumentationService: IInstrumentationService,
		filesRepository: IFilesRepository,
	) =>
	(fileId: number, newName: string): Promise<void> => {
		return instrumentationService.startSpan(
			{ name: "renameFileUseCase", op: "function" },
			async () => {
				return await filesRepository.renameFile(fileId, newName);
			},
		);
	};
