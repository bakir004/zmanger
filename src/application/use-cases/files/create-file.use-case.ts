import type { IInstrumentationService } from "~/application/services/instrumentation.service.interface";
import type { IFilesRepository } from "~/application/repositories/files.repository.interface";
import { auth } from "@clerk/nextjs/server";

export type ICreateFileUseCase = ReturnType<typeof createFileUseCase>;

export const createFileUseCase =
	(
		instrumentationService: IInstrumentationService,
		filesRepository: IFilesRepository,
	) =>
	(input: {
		userId: string;
		fileName: string;
		type: "file" | "folder";
		parentId: number | null;
	}): Promise<void> => {
		return instrumentationService.startSpan(
			{ name: "createFileUseCase", op: "function" },

			async () => {
				//check if user has plan pro or pro+
				const { clerkClient } = await import("@clerk/nextjs/server");
				const clerk = await clerkClient();
				const user = await clerk.users.getUser(input.userId);

				// get current user file count
				const files = await filesRepository.getFilesForUser(input.userId);
				const currentFileCount = files.filter(
					(file) => file.type === "file",
				).length;

				const userPlan = user.publicMetadata.plan;

				if (userPlan === "pro" && currentFileCount + 1 > 10) {
					throw new Error("User does not have pro+ plan");
					// biome-ignore lint/style/noUselessElse: <explanation>
				} else if (userPlan === "pro+" && currentFileCount + 1 > 100) {
					throw new Error("Too many files");
					// biome-ignore lint/style/noUselessElse: <explanation>
				} else if (
					(userPlan === "free" || !userPlan) &&
					currentFileCount + 1 > 1
				) {
					throw new Error("User does not have pro plan");
				}

				await filesRepository.createFile(
					input.userId,
					input.fileName,
					input.type,
					input.parentId,
				);
			},
		);
	};
