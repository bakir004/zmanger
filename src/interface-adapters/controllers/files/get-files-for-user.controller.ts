import type { IInstrumentationService } from "~/application/services/instrumentation.service.interface";
import type { IGetFilesForUserUseCase } from "~/application/use-cases/files/get-files-for-user.use-case";
import { UnauthenticatedError } from "~/entities/errors/auth";
import type { File } from "~/entities/models/file";

export type IGetFilesForUserController = ReturnType<
	typeof getFilesForUserController
>;

export const getFilesForUserController =
	(
		instrumentationService: IInstrumentationService,
		getFilesForUserUseCase: IGetFilesForUserUseCase,
	) =>
	async (userId: string): Promise<File[]> => {
		return await instrumentationService.startSpan(
			{
				name: "getFilesForUserController",
			},
			async () => {
				if (!userId)
					throw new UnauthenticatedError("Must be logged in to get files");

				return await getFilesForUserUseCase(userId);
			},
		);
	};
