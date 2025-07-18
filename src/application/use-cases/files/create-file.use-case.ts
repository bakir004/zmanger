import type { IInstrumentationService } from "~/application/services/instrumentation.service.interface";
import type { IFilesRepository } from "~/application/repositories/files.repository.interface";

export type ICreateFileUseCase = ReturnType<typeof createFileUseCase>;

export const createFileUseCase =
	(
		instrumentationService: IInstrumentationService,
		filesRepository: IFilesRepository,
	) =>
	(input: {
		userId: string;
		fileName: string;
		type: "file" | "folder";
		parentId: number | null;
	}): Promise<void> => {
		return instrumentationService.startSpan(
			{ name: "createFileUseCase", op: "function" },
			async () => {
				await filesRepository.createFile(
					input.userId,
					input.fileName,
					input.type,
					input.parentId,
				);
			},
		);
	};
