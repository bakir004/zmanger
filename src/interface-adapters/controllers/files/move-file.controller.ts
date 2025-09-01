import type { IInstrumentationService } from "~/application/services/instrumentation.service.interface";
import type { IMoveFileUseCase } from "~/application/use-cases/files/move-file.use-case";

export type IMoveFileController = ReturnType<typeof moveFileController>;

export const moveFileController =
	(
		instrumentationService: IInstrumentationService,
		moveFileUseCase: IMoveFileUseCase,
	) =>
	async (
		userId: string,
		{ fileId, newParentId }: { fileId: number; newParentId: number | null },
	): Promise<void> => {
		return await instrumentationService.startSpan(
			{
				name: "moveFileController",
			},
			async () => {
				return await moveFileUseCase(fileId, newParentId);
			},
		);
	};
