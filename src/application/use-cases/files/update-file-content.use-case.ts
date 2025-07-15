import type { IInstrumentationService } from "~/application/services/instrumentation.service.interface";
import type { IFilesRepository } from "~/application/repositories/files.repository.interface";

export type IUpdateFileContentUseCase = ReturnType<
	typeof updateFileContentUseCase
>;

export const updateFileContentUseCase =
	(
		instrumentationService: IInstrumentationService,
		filesRepository: IFilesRepository,
	) =>
	(input: {
		fileId: number;
		content: string;
	}): Promise<void> => {
		return instrumentationService.startSpan(
			{ name: "updateFileContentUseCase", op: "function" },
			async () => {
				await filesRepository.updateFileContent(input.fileId, input.content);
			},
		);
	};
