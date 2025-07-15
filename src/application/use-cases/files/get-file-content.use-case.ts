import type { IInstrumentationService } from "~/application/services/instrumentation.service.interface";
import type { IFilesRepository } from "../../repositories/files.repository.interface";

export type IGetFileContentUseCase = ReturnType<typeof getFileContentUseCase>;

export const getFileContentUseCase =
	(
		instrumentationService: IInstrumentationService,
		filesRepository: IFilesRepository,
	) =>
	(fileId: number): Promise<string> => {
		return instrumentationService.startSpan(
			{ name: "getFileContentUseCase", op: "function" },
			async () => {
				return await filesRepository.getFileContent(fileId);
			},
		);
	};
