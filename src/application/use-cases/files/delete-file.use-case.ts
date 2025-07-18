import type { IInstrumentationService } from "~/application/services/instrumentation.service.interface";
import type { IFilesRepository } from "~/application/repositories/files.repository.interface";

export type IDeleteFileUseCase = ReturnType<typeof deleteFileUseCase>;

export const deleteFileUseCase =
	(
		instrumentationService: IInstrumentationService,
		filesRepository: IFilesRepository,
	) =>
	(input: {
		fileId: number;
	}): Promise<void> => {
		return instrumentationService.startSpan(
			{ name: "deleteFileUseCase", op: "function" },
			async () => {
				await filesRepository.deleteFile(input.fileId);
			},
		);
	};
