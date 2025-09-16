import type { IInstrumentationService } from "~/application/services/instrumentation.service.interface";
import type { ICreateNotificationUseCase } from "~/application/use-cases/notifications/create-notification.use-case";
import type { NotificationInsert } from "~/entities/models/notification";
import { UnauthenticatedError } from "~/entities/errors/auth";
import { InputParseError } from "~/entities/errors/common";
import { z } from "zod";

const inputSchema = z.object({
	notification: z.object({
		title: z.string().min(1).max(256),
		description: z.string().optional(),
		type: z.string().optional().default("info"),
		actionUrl: z.string().optional(),
		actionLabel: z.string().optional(),
	}),
});

export type ICreateNotificationController = ReturnType<
	typeof createNotificationController
>;

export const createNotificationController =
	(
		instrumentationService: IInstrumentationService,
		createNotificationUseCase: ICreateNotificationUseCase,
	) =>
	async (
		userId: string | undefined,
		input: Partial<z.infer<typeof inputSchema>>,
	): Promise<void> => {
		return await instrumentationService.startSpan(
			{
				name: "createNotificationController",
			},
			async () => {
				if (!userId)
					throw new UnauthenticatedError(
						"Must be logged in to create notification",
					);

				const { data, error: inputParseError } = inputSchema.safeParse(input);

				if (inputParseError) {
					throw new InputParseError("Invalid input");
				}

				await createNotificationUseCase({ notification: data.notification });
			},
		);
	};
