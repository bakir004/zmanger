import type { IInstrumentationService } from "~/application/services/instrumentation.service.interface";
import type { IFilesRepository } from "../../repositories/files.repository.interface";
import type { File } from "~/entities/models/file";

export type IGetFilesForUserUseCase = ReturnType<typeof getFilesForUserUseCase>;

export const getFilesForUserUseCase =
	(
		instrumentationService: IInstrumentationService,
		filesRepository: IFilesRepository,
	) =>
	(userId: string): Promise<File[]> => {
		return instrumentationService.startSpan(
			{ name: "getFilesForUserUseCase", op: "function" },
			async () => {
				return await filesRepository.getFilesForUser(userId);
			},
		);
	};
