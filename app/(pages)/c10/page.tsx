"use client";

import { FileSidebar } from "app/(pages)/c10/_components/file-sidebar/file-sidebar";
import { SidebarInset, SidebarProvider } from "app/_components/ui/sidebar";

import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "app/_components/ui/resizable";
import { useState, useEffect, useCallback } from "react";
import {
	getFileContent,
	getTestsByBatchId,
	runSingleTest,
	updateFileContent,
} from "./actions";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import type { Test } from "~/entities/models/test";
import type { ExecutionResultWithTestId } from "~/entities/models/execution-result";
import { Header } from "./_components/header";
import { EditorMain } from "./_components/editors/editor-main";
import { EditorStdin } from "./_components/editors/editor-stdin";
import { EditorStdout } from "./_components/editors/editor-stdout";
import { SidebarTests } from "./_components/sidebar-tests/sidebar-tests";
import { OpenedFilesTrack } from "./_components/opened-files-track";

export default function Page() {
	const [code, setCode] = useState(
		'#include<iostream>\nint main() { std::cout << "gewad"; return 0; }',
	);
	const [stdin, setStdin] = useState("");
	const [stdout, setStdout] = useState("");
	const [language, setLanguage] = useState<"cpp" | "c">("cpp");

	const [loading, setLoading] = useState(false);
	const [currentFileId, setCurrentFileId] = useState<number | null>(null);
	const [currentFileName, setCurrentFileName] = useState<string>("");

	const queryClient = useQueryClient();

	const updateFileMutation = useMutation({
		mutationFn: async ({ fileId, code }: { fileId: number; code: string }) => {
			return updateFileContent(fileId, code);
		},
		onSuccess: (data, variables) => {
			queryClient.setQueryData(["fileContent", variables.fileId], {
				content: variables.code,
				name: currentFileName,
			});
		},
	});

	// Handle Ctrl+S keyboard shortcut
	const handleSave = useCallback(async () => {
		if (currentFileId === null) {
			console.log("No file selected to save");
			return;
		}
		try {
			await updateFileMutation.mutateAsync({ fileId: currentFileId, code });
		} catch (error) {
			console.error("Failed to save file:", error);
		}
	}, [currentFileId, code, updateFileMutation]);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if ((event.ctrlKey || event.metaKey) && event.key === "s") {
				event.preventDefault();
				handleSave();
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [handleSave]);

	const run = async () => {
		await handleSave();
		setLoading(true);
		const executionResult = await runTest(0);
		if (executionResult?.compileOutput) {
			setStdout(executionResult?.compileOutput);
		} else if (executionResult?.stderr) {
			setStdout(executionResult?.stderr);
		} else {
			setStdout(executionResult?.stdout ?? "");
		}
		setLoading(false);
	};

	const runTest = async (testId: number) => {
		let testToRun = tests.find((test) => test.id === testId);
		if (testId === 0)
			testToRun = {
				id: 0,
				code: {
					topOfFile: "",
					aboveMain: "",
					main: "_main(); return 0;",
				},
				expectedOutput: [""],
				hidden: false,
				testBatchId: 0,
				stdin: stdin,
			};
		if (!testToRun) return;

		const executionResult = await runSingleTest({
			code,
			language,
			test: testToRun,
		});
		return executionResult;
	};

	const [tests, setTests] = useState<Test[]>([]);
	const [loadingTestBatch, setLoadingTestBatch] = useState(false);

	const handleTestBatchChange = async (value: string) => {
		setLoadingTestBatch(true);
		const tests = await queryClient.fetchQuery({
			queryKey: ["testsByBatch", value],
			queryFn: () => getTestsByBatchId(Number(value)),
		});
		setTests(tests?.sort((a, b) => a.id - b.id) ?? []);
		setLoadingTestBatch(false);
	};

	// const { data: files, isLoading: filesLoading } = useQuery({
	// 	queryKey: ["files"],
	// 	queryFn: getFilesForUser,
	// });

	const [executionResults, setExecutionResults] = useState<
		ExecutionResultWithTestId[]
	>([]);

	const runAllTests = async () => {
		await handleSave();
		setLoading(true);
		const executionResults: (ExecutionResultWithTestId | undefined)[] =
			await Promise.all(tests.map((test) => runTest(test.id)));
		executionResults.sort((a, b) => (a?.testId ?? 0) - (b?.testId ?? 0));
		setExecutionResults(executionResults as ExecutionResultWithTestId[]);
		setLoading(false);
	};

	const handleFileClick = async (id: number) => {
		const fileData = await queryClient.fetchQuery({
			queryKey: ["fileContent", id],
			queryFn: () => getFileContent(id),
		});
		if (fileData) {
			setCode(fileData.content ?? "");
			setCurrentFileName(fileData.name ?? "");
		}
		setCurrentFileId(id);
	};

	const savingFile = updateFileMutation.isPending;

	return (
		<SidebarProvider>
			<FileSidebar
				handleFileClick={handleFileClick}
				// filesLoading={filesLoading}
				// files={files ?? []}
			/>
			<SidebarInset>
				<Header
					run={run}
					runAllTests={runAllTests}
					handleSave={handleSave}
					loading={loading}
					savingFile={savingFile}
					testsLength={tests.length}
				/>
				<ResizablePanelGroup direction="horizontal">
					<ResizablePanel>
						<ResizablePanelGroup
							direction="vertical"
							className="h-[calc(100vh-96px)]"
						>
							<ResizablePanel>
								<OpenedFilesTrack currentFileName={currentFileName} />
								{currentFileName ? (
									<EditorMain code={code} setCode={setCode} />
								) : (
									<div className="flex h-full items-center justify-center">
										<p className="text-sm text-gray-500 -mt-12">
											Otvorite datoteku
										</p>
									</div>
								)}
							</ResizablePanel>
							<ResizableHandle />
							<ResizablePanel defaultSize={30}>
								<ResizablePanelGroup direction="horizontal" className="flex">
									<ResizablePanel>
										<EditorStdin stdin={stdin} setStdin={setStdin} />
									</ResizablePanel>
									<ResizableHandle />
									<ResizablePanel>
										<EditorStdout stdout={stdout} loading={loading} />
									</ResizablePanel>
								</ResizablePanelGroup>
							</ResizablePanel>
						</ResizablePanelGroup>
					</ResizablePanel>
					<ResizableHandle />
					<ResizablePanel
						maxSize={25}
						minSize={20}
						className="bg-transparent p-2"
						defaultSize={20}
					>
						<SidebarTests
							handleTestBatchChange={handleTestBatchChange}
							loadingTestBatch={loadingTestBatch}
							tests={tests}
							executionResults={executionResults}
							runTest={runTest}
						/>
					</ResizablePanel>
				</ResizablePanelGroup>
			</SidebarInset>
		</SidebarProvider>
	);
}
