import { db } from "drizzle";
import { files } from "drizzle/schema";
import type { ICrashReporterService } from "~/application/services/crash-reporter.service.interface";
import type { IInstrumentationService } from "~/application/services/instrumentation.service.interface";
import { eq } from "drizzle-orm";
import type { IFilesRepository } from "~/application/repositories/files.repository.interface";
import type { File } from "~/entities/models/file";

export class FilesRepository implements IFilesRepository {
	constructor(
		private readonly instrumentationService: IInstrumentationService,
		private readonly crashReporterService: ICrashReporterService,
	) {}

	async getFilesForUser(userId: string): Promise<File[]> {
		return await this.instrumentationService.startSpan(
			{ name: "FilesRepository > getFilesForUser" },
			async () => {
				try {
					const foundFiles = await db
						.select()
						.from(files)
						.where(eq(files.userId, userId));

					return foundFiles;
				} catch (error) {
					this.crashReporterService.report(error);
					throw error;
				}
			},
		);
	}

	async getFileContent(fileId: number): Promise<string> {
		return await this.instrumentationService.startSpan(
			{ name: "FilesRepository > getFileContent" },
			async () => {
				try {
					const foundFile = await db
						.select()
						.from(files)
						.where(eq(files.id, fileId));

					if (!foundFile[0]) {
						throw new Error("File not found");
					}

					return foundFile[0].content ?? "";
				} catch (error) {
					this.crashReporterService.report(error);
					throw error;
				}
			},
		);
	}

	async updateFileContent(fileId: number, content: string): Promise<void> {
		return await this.instrumentationService.startSpan(
			{ name: "FilesRepository > updateFileContent" },
			async () => {
				try {
					await db.update(files).set({ content }).where(eq(files.id, fileId));
				} catch (error) {
					this.crashReporterService.report(error);
					throw error;
				}
			},
		);
	}

	async createFile(
		userId: string,
		fileName: string,
		type: "file" | "folder",
		parentId: number | null,
	): Promise<void> {
		return await this.instrumentationService.startSpan(
			{ name: "FilesRepository > createFile" },
			async () => {
				try {
					const fileToBeAdded: Omit<File, "id"> = {
						userId,
						name: fileName,
						type,
						content: type === "file" ? "" : null,
						parentId,
						createdAt: new Date(),
						updatedAt: new Date(),
					};
					await db.insert(files).values(fileToBeAdded);
				} catch (error) {
					this.crashReporterService.report(error);
					throw error;
				}
			},
		);
	}

	async deleteFile(fileId: number): Promise<void> {
		return await this.instrumentationService.startSpan(
			{ name: "FilesRepository > deleteFile" },
			async () => {
				try {
					await db.delete(files).where(eq(files.id, fileId));
				} catch (error) {
					this.crashReporterService.report(error);
					throw error;
				}
			},
		);
	}
}
