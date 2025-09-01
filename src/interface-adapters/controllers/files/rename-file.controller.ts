import type { IInstrumentationService } from "~/application/services/instrumentation.service.interface";
import type { IRenameFileUseCase } from "~/application/use-cases/files/rename-file.use-case";

export type IRenameFileController = ReturnType<typeof renameFileController>;

export const renameFileController =
	(
		instrumentationService: IInstrumentationService,
		renameFileUseCase: IRenameFileUseCase,
	) =>
	async (
		userId: string,
		{ fileId, newName }: { fileId: number; newName: string },
	): Promise<void> => {
		return await instrumentationService.startSpan(
			{
				name: "renameFileController",
			},
			async () => {
				return await renameFileUseCase(fileId, newName);
			},
		);
	};
