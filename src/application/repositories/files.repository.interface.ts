import type { File } from "~/entities/models/file";

export interface IFilesRepository {
	getFilesForUser(userId: string): Promise<File[]>;
	getFileContent(fileId: number): Promise<string>;
	updateFileContent(fileId: number, content: string): Promise<void>;
}
