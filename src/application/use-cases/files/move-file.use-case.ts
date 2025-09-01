import type { IInstrumentationService } from "~/application/services/instrumentation.service.interface";
import type { IFilesRepository } from "../../repositories/files.repository.interface";

export type IMoveFileUseCase = ReturnType<typeof moveFileUseCase>;

export const moveFileUseCase =
	(
		instrumentationService: IInstrumentationService,
		filesRepository: IFilesRepository,
	) =>
	(fileId: number, newParentId: number | null): Promise<void> => {
		return instrumentationService.startSpan(
			{ name: "moveFileUseCase", op: "function" },
			async () => {
				return await filesRepository.moveFile(fileId, newParentId);
			},
		);
	};
