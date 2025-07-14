import type { File } from "~/entities/models/file";

export interface IFilesRepository {
	getFilesForUser(userId: string): Promise<File[]>;
}
