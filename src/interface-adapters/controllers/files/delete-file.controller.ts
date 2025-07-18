import { z } from "zod";
import { UnauthenticatedError } from "~/entities/errors/auth";
import { InputParseError } from "~/entities/errors/common";
import type { IInstrumentationService } from "~/application/services/instrumentation.service.interface";
import type { IDeleteFileUseCase } from "~/application/use-cases/files/delete-file.use-case";

const inputSchema = z.object({
	fileId: z.number(),
});

export type IDeleteFileController = ReturnType<typeof deleteFileController>;

export const deleteFileController =
	(
		instrumentationService: IInstrumentationService,
		deleteFileUseCase: IDeleteFileUseCase,
	) =>
	async (
		userId: string | undefined,
		input: Partial<z.infer<typeof inputSchema>>,
	): Promise<void> => {
		return await instrumentationService.startSpan(
			{
				name: "deleteFileController",
			},
			async () => {
				if (!userId)
					throw new UnauthenticatedError("Must be logged in to delete file");

				const { data, error: inputParseError } = inputSchema.safeParse(input);

				if (inputParseError) {
					throw new InputParseError("Invalid input");
				}

				return await instrumentationService.startSpan(
					{ name: "deleteFileController > deleteFileUseCase" },
					async () => {
						await deleteFileUseCase(data);
					},
				);
			},
		);
	};
