"use server";

import { auth } from "@clerk/nextjs/server";
import { getInjection } from "di/container";
import { UnauthenticatedError } from "~/entities/errors/auth";
import type { Test, TestWithUserCodeAndLanguage } from "~/entities/models/test";
import type { File } from "~/entities/models/file";

export async function getTestBatches() {
	const instrumentationService = getInjection("IInstrumentationService");

	return await instrumentationService.instrumentServerAction(
		"getTestBatches",
		{ recordResponse: true },
		async () => {
			try {
				const getTestBatchesController = getInjection(
					"IGetTestBatchesController",
				);
				return await getTestBatchesController();
			} catch (error) {
				console.error(error);
			}
		},
	);
}

export async function getTestsByBatchId(testBatchId: number) {
	const instrumentationService = getInjection("IInstrumentationService");

	return await instrumentationService.instrumentServerAction(
		"getTestsByBatchId",
		{ recordResponse: true },
		async () => {
			try {
				const getTestsByBatchIdController = getInjection(
					"IGetTestsByBatchIdController",
				);
				return await getTestsByBatchIdController(testBatchId);
			} catch (error) {
				console.error(error);
			}
		},
	);
}

export async function runSingleTest({
	code,
	language,
	test,
}: {
	code: string;
	language: string;
	test: Test;
}) {
	const instrumentationService = getInjection("IInstrumentationService");

	return await instrumentationService.instrumentServerAction(
		"runSingleTest",
		{ recordResponse: true },
		async () => {
			try {
				const runSingleTestController = getInjection(
					"IRunSingleTestController",
				);

				const testWithUserCodeAndLanguage: TestWithUserCodeAndLanguage = {
					test: test,
					userCode: code,
					language,
				};
				return await runSingleTestController(
					"asd",
					testWithUserCodeAndLanguage,
				);
			} catch (error) {
				console.error(error);
			}
		},
	);
}

export type SidebarTree = Array<{ id: number; name: string } | SidebarTree>;

// Helper: build a map of id → file with children array
function buildFileMap(files: File[]) {
	const map = new Map<number, File & { children: File[] }>();
	for (const file of files) {
		map.set(file.id, { ...file, children: [] });
	}
	for (const file of map.values()) {
		if (file.parentId !== null) {
			const parent = map.get(file.parentId);
			if (parent) {
				parent.children.push(file);
			}
		}
	}
	return map;
}

// Recursive: build sidebar tree from a folder node
function buildSidebarTree(node: File & { children: File[] }): SidebarTree {
	const sortedChildren = [...node.children].sort((a, b) => {
		if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
		return a.name.localeCompare(b.name, undefined, {
			numeric: true,
			sensitivity: "base",
		});
	});
	return sortedChildren.map((child) => {
		if (child.type === "folder") {
			// For folders: [name, ...children]
			return [
				{ id: child.id, name: child.name },
				...buildSidebarTree(child as File & { children: File[] }),
			];
		}
		// For files: just the name
		return { id: child.id, name: child.name };
	});
}

// Main: transform flat files array to sidebar tree
export async function filesToSidebarTree(files: File[]): Promise<SidebarTree> {
	if (!files || files.length === 0) {
		return [];
	}
	const map = buildFileMap(files);
	const roots = Array.from(map.values()).filter(
		(file) => file.parentId === null,
	);
	const sortedRoots = roots.sort((a, b) => {
		if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
		return a.name.localeCompare(b.name, undefined, {
			numeric: true,
			sensitivity: "base",
		});
	});
	return sortedRoots.map((root) => {
		if (root.type === "folder") {
			return [{ id: root.id, name: root.name }, ...buildSidebarTree(root)];
		}
		return { id: root.id, name: root.name };
	});
}

export async function getFilesForUser() {
	const instrumentationService = getInjection("IInstrumentationService");

	return await instrumentationService.instrumentServerAction(
		"getFilesForUser",
		{ recordResponse: true },
		async () => {
			try {
				const getFilesForUserController = getInjection(
					"IGetFilesForUserController",
				);
				const { userId } = await auth();
				if (!userId)
					throw new UnauthenticatedError("Must be logged in to get files");
				const files: File[] = await getFilesForUserController(userId);
				const tree = await filesToSidebarTree(files);
				console.log(tree);
				return tree;
			} catch (error) {
				console.error(error);
			}
		},
	);
}

export async function getFileContent(fileId: number) {
	const instrumentationService = getInjection("IInstrumentationService");

	return await instrumentationService.instrumentServerAction(
		"getFileContent",
		{ recordResponse: true },
		async () => {
			try {
				const getFileContentController = getInjection(
					"IGetFileContentController",
				);
				return await getFileContentController(fileId);
			} catch (error) {
				console.error(error);
			}
		},
	);
}

export async function updateFileContent(fileId: number, content: string) {
	const instrumentationService = getInjection("IInstrumentationService");

	return await instrumentationService.instrumentServerAction(
		"updateFileContent",
		{ recordResponse: true },
		async () => {
			try {
				const updateFileContentController = getInjection(
					"IUpdateFileContentController",
				);
				const { userId } = await auth();
				if (!userId)
					throw new UnauthenticatedError(
						"Must be logged in to update file content",
					);
				return await updateFileContentController(userId, { fileId, content });
			} catch (error) {
				console.error(error);
			}
		},
	);
}

export async function createFile(
	fileName: string,
	type: "file" | "folder",
	parentId: number | null,
) {
	const instrumentationService = getInjection("IInstrumentationService");

	return await instrumentationService.instrumentServerAction(
		"createFile",
		{ recordResponse: true },
		async () => {
			try {
				const createFileController = getInjection("ICreateFileController");
				const { userId } = await auth();
				if (!userId)
					throw new UnauthenticatedError("Must be logged in to create file");
				return await createFileController(userId, { fileName, type, parentId });
			} catch (error) {
				console.error(error);
			}
		},
	);
}

export async function deleteFile(fileId: number) {
	const instrumentationService = getInjection("IInstrumentationService");

	return await instrumentationService.instrumentServerAction(
		"deleteFile",
		{ recordResponse: true },
		async () => {
			try {
				const deleteFileController = getInjection("IDeleteFileController");
				const { userId } = await auth();
				if (!userId)
					throw new UnauthenticatedError("Must be logged in to delete file");
				return await deleteFileController(userId, { fileId });
			} catch (error) {
				console.error(error);
			}
		},
	);
}
