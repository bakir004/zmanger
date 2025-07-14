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
}
