import { z } from "zod";
import { UnauthenticatedError } from "~/entities/errors/auth";
import { InputParseError } from "~/entities/errors/common";
import type { IInstrumentationService } from "~/application/services/instrumentation.service.interface";
import type { IUpdateFileContentUseCase } from "~/application/use-cases/files/update-file-content.use-case";

const inputSchema = z.object({
	fileId: z.number(),
	content: z.string(),
});

export type IUpdateFileContentController = ReturnType<
	typeof updateFileContentController
>;

export const updateFileContentController =
	(
		instrumentationService: IInstrumentationService,
		updateFileContentUseCase: IUpdateFileContentUseCase,
	) =>
	async (
		userId: string | undefined,
		input: Partial<z.infer<typeof inputSchema>>,
	): Promise<void> => {
		return await instrumentationService.startSpan(
			{
				name: "updateFileContentController",
			},
			async () => {
				if (!userId)
					throw new UnauthenticatedError(
						"Must be logged in to update file content",
					);

				const { data, error: inputParseError } = inputSchema.safeParse(input);

				if (inputParseError) {
					throw new InputParseError("Invalid input");
				}

				return await instrumentationService.startSpan(
					{ name: "updateFileContentController > updateFileContentUseCase" },
					async () => {
						await updateFileContentUseCase(data);
					},
				);
			},
		);
	};
