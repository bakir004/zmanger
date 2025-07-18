import { z } from "zod";
import { UnauthenticatedError } from "~/entities/errors/auth";
import { InputParseError } from "~/entities/errors/common";
import type { IInstrumentationService } from "~/application/services/instrumentation.service.interface";
import type { ICreateFileUseCase } from "~/application/use-cases/files/create-file.use-case";

const inputSchema = z.object({
	fileName: z.string(),
	type: z.enum(["file", "folder"]),
	parentId: z.number().nullable(),
});

export type ICreateFileController = ReturnType<typeof createFileController>;

export const createFileController =
	(
		instrumentationService: IInstrumentationService,
		createFileUseCase: ICreateFileUseCase,
	) =>
	async (
		userId: string | undefined,
		input: Partial<z.infer<typeof inputSchema>>,
	): Promise<void> => {
		return await instrumentationService.startSpan(
			{
				name: "createFileController",
			},
			async () => {
				if (!userId)
					throw new UnauthenticatedError("Must be logged in to create file");

				const { data, error: inputParseError } = inputSchema.safeParse(input);

				if (inputParseError) {
					throw new InputParseError("Invalid input");
				}

				const fileData = {
					userId,
					...data,
				};

				return await instrumentationService.startSpan(
					{ name: "createFileController > createFileUseCase" },
					async () => {
						await createFileUseCase(fileData);
					},
				);
			},
		);
	};
