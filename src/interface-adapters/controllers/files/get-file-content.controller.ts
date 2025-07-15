import type { IInstrumentationService } from "~/application/services/instrumentation.service.interface";
import type { IGetFileContentUseCase } from "~/application/use-cases/files/get-file-content.use-case";

export type IGetFileContentController = ReturnType<
	typeof getFileContentController
>;

export const getFileContentController =
	(
		instrumentationService: IInstrumentationService,
		getFileContentUseCase: IGetFileContentUseCase,
	) =>
	async (fileId: number): Promise<string> => {
		return await instrumentationService.startSpan(
			{
				name: "getFileContentController",
			},
			async () => {
				return await getFileContentUseCase(fileId);
			},
		);
	};
