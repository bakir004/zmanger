"use client";

import { FileSidebar } from "app/_components/file-sidebar";
import { Separator } from "app/_components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "app/_components/ui/sidebar";

import Editor from "@monaco-editor/react";
import {
	AlertTriangle,
	Bug,
	Check,
	CheckCheck,
	LoaderCircle,
	Play,
	Power,
	Save,
	Terminal,
	X,
} from "lucide-react";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "app/_components/ui/resizable";
import {
	Select,
	SelectLabel,
	SelectContent,
	SelectGroup,
	SelectTrigger,
	SelectItem,
	SelectValue,
} from "app/_components/ui/select";
import { geistMono } from "app/_fonts/fonts";
import { useState, useEffect, useCallback } from "react";
import { Button } from "app/_components/ui/button";
import {
	getFileContent,
	getFilesForUser,
	getTestBatches,
	getTestsByBatchId,
	runSingleTest,
	updateFileContent,
} from "./actions";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Test } from "~/entities/models/test";
import { ScrollArea, ScrollBar } from "app/_components/ui/scroll-area";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "app/_components/ui/table";
import { Skeleton } from "app/_components/ui/skeleton";
import type {
	ExecutionResult,
	ExecutionResultWithTestId,
} from "~/entities/models/execution-result";
import {
	Dialog,
	DialogTitle,
	DialogHeader,
	DialogContent,
	DialogTrigger,
	DialogDescription,
} from "app/_components/ui/dialog";

export default function Page() {
	const [code, setCode] = useState(
		'#include<iostream>\nint main() { std::cout << "niggas"; return 0; }',
	);
	const [stdin, setStdin] = useState("");
	const [stdout, setStdout] = useState("");
	const [language, setLanguage] = useState<"cpp" | "c">("cpp");
	const [pingSuccess, setPingSuccess] = useState(false);
	const [pingFail, setPingFail] = useState(false);
	const [outputMessage, setOutputMessage] = useState("");
	const [savingFile, setSavingFile] = useState(false);

	const [loading, setLoading] = useState(false);
	const [currentFileId, setCurrentFileId] = useState<number | null>(null);

	const queryClient = useQueryClient();

	// Handle Ctrl+S keyboard shortcut
	const handleSave = useCallback(async () => {
		if (currentFileId === null) {
			console.log("No file selected to save");
			return;
		}
		try {
			setSavingFile(true);
			await updateFileContent(currentFileId, code);
			queryClient.setQueryData(["fileContent", currentFileId], code);
			setSavingFile(false);
		} catch (error) {
			console.error("Failed to save file:", error);
		}
	}, [currentFileId, code, queryClient]);

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

	const { data: testBatches, isLoading: testBatchesLoading } = useQuery({
		queryKey: ["testBatches"],
		queryFn: getTestBatches,
	});

	const run = async () => {
		await handleSave();
		setLoading(true);
		const executionResult = await runTest(0);
		console.log(executionResult);
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

	const { data: files, isLoading: filesLoading } = useQuery({
		queryKey: ["files"],
		queryFn: getFilesForUser,
	});

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
		const fileContent = await queryClient.fetchQuery({
			queryKey: ["fileContent", id],
			queryFn: () => getFileContent(id),
		});
		setCode(fileContent ?? "");
		setCurrentFileId(id);
	};

	return (
		<SidebarProvider>
			<FileSidebar
				handleFileClick={handleFileClick}
				filesLoading={filesLoading}
				files={files ?? []}
			/>
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-transparent">
					<SidebarTrigger className="-ml-1" />
					<Separator
						orientation="vertical"
						className="mr-2 data-[orientation=vertical]:h-4"
					/>
					<Button
						onClick={run}
						disabled={loading}
						className="flex bg-secondary-gradient items-center gap-2 cursor-pointer"
					>
						{loading ? (
							<>
								<LoaderCircle className="animate-spin" />
								Pokrećem
							</>
						) : (
							<>
								<Terminal />
								Pokreni kod
							</>
						)}
					</Button>
					<Button
						onClick={runAllTests}
						disabled={loading || tests.length === 0}
						className="flex bg-primary-gradient items-center gap-2 cursor-pointer"
					>
						{loading ? (
							<>
								<LoaderCircle className="animate-spin" />
								Pokrećem
							</>
						) : (
							<>
								<Power />
								Pokreni testove
							</>
						)}
					</Button>
					<Button
						onClick={handleSave}
						disabled={savingFile}
						className="flex bg-primary-gradient items-center gap-2 cursor-pointer"
					>
						{savingFile ? <LoaderCircle className="animate-spin" /> : <Save />}
						Spremi
					</Button>
				</header>

				<ResizablePanelGroup direction="horizontal">
					<ResizablePanel>
						<ResizablePanelGroup
							direction="vertical"
							className="h-[calc(100vh-96px)]"
						>
							<ResizablePanel>
								<div className="h-8 w-full flex items-center ">
									<div className="flex h-full items-center gap-1 px-2 cursor-pointer text-xs border-r">
										<img
											className="w-3 h-3"
											alt="cpp"
											src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-plain.svg"
										/>
										main.cpp
										{/* <X className="w-3 h-3 mt-0.5" /> */}
									</div>
									<div className="flex h-full items-center gap-1 px-2 bg-[#020205] cursor-pointer text-xs">
										<img
											className="w-3 h-3"
											alt="c"
											src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/c/c-plain.svg"
										/>{" "}
										main.c
										<X className="w-3 h-3 mt-0.5 hover:text-red-400" />
									</div>
								</div>
								<div className={"h-full"}>
									<Editor
										value={code}
										onChange={(s) => setCode(s ?? "")}
										theme="vs-dark"
										language="cpp"
										options={{
											fontFamily: "Geist Mono",
											minimap: { enabled: false },
											fontSize: 14,
										}}
									/>
								</div>
							</ResizablePanel>
							<ResizableHandle />
							<ResizablePanel defaultSize={30}>
								<ResizablePanelGroup direction="horizontal" className="flex">
									<ResizablePanel>
										<div
											className={`text-sm py-1 px-2 bg-transparent font-mono  ${geistMono.className}`}
										>
											stdin
										</div>
										<Editor
											value={stdin}
											theme="vs-dark"
											onChange={(s) => setStdin(s ?? "")}
											options={{
												lineNumbers: "off",
												minimap: { enabled: false },
												fontFamily: "Geist Mono",
											}}
										/>
									</ResizablePanel>
									<ResizableHandle />
									<ResizablePanel>
										<div
											className={`text-sm py-1 px-2 bg-transparent flex items-center gap-2 ${geistMono.className}`}
										>
											stdout
											{loading && (
												<LoaderCircle className={"w-4 h-4 animate-spin"} />
											)}
											<div className="relative w-4 h-4">
												{pingSuccess && (
													<Check className="absolute inset-0 w-4 h-4 animate-ping text-green-300" />
												)}
												{pingFail && (
													<X className="absolute inset-0 w-4 h-4 animate-ping text-red-400" />
												)}
												{!loading && (
													<Check className="absolute inset-0 w-4 h-4 text-green-400" />
												)}
											</div>
											- <p className={"text-red-400"}>{outputMessage}</p>
										</div>
										<Editor
											value={stdout}
											theme="vs-dark"
											options={{
												lineNumbers: "off",
												minimap: { enabled: false },
												readOnly: true,
												fontFamily: "Geist Mono",
											}}
										/>
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
						<Select
							disabled={testBatchesLoading}
							onValueChange={handleTestBatchChange}
						>
							<SelectTrigger className="w-full">
								<SelectValue
									placeholder={
										testBatchesLoading ? "Učitavam..." : "Izaberite testove"
									}
								/>
							</SelectTrigger>
							<SelectContent className="-mr-1">
								<SelectGroup>
									<SelectLabel>TP Zadaca 1</SelectLabel>
									{testBatches?.map((testBatch) => (
										<SelectItem
											key={testBatch.id}
											value={testBatch.id.toString()}
										>
											{testBatch.language === "cpp" ? (
												<svg viewBox="0 0 128 128">
													<title>cpp</title>
													<path
														fill="#00599c"
														d="M118.766 95.82c.89-1.543 1.441-3.28 1.441-4.843V36.78c0-1.558-.55-3.297-1.441-4.84l-55.32 31.94Zm0 0"
													/>
													<path
														fill="#004482"
														d="m68.36 126.586 46.933-27.094c1.352-.781 2.582-2.129 3.473-3.672l-55.32-31.94L8.12 95.82c.89 1.543 2.121 2.89 3.473 3.672l46.933 27.094c2.703 1.562 7.13 1.562 9.832 0Zm0 0"
													/>{" "}
													<path
														fill="#659ad2"
														d="M118.766 31.941c-.891-1.546-2.121-2.894-3.473-3.671L68.359 1.172c-2.703-1.563-7.129-1.563-9.832 0L11.594 28.27C8.89 29.828 6.68 33.66 6.68 36.78v54.196c0 1.562.55 3.3 1.441 4.843L63.445 63.88Zm0 0"
													/>{" "}
													<path
														fill="#fff"
														d="M63.445 26.035c-20.867 0-37.843 16.977-37.843 37.844s16.976 37.844 37.843 37.844c13.465 0 26.024-7.247 32.77-18.91L79.84 73.335c-3.38 5.84-9.66 9.465-16.395 9.465-10.433 0-18.922-8.488-18.922-18.922 0-10.434 8.49-18.922 18.922-18.922 6.73 0 13.017 3.629 16.39 9.465l16.38-9.477c-6.75-11.664-19.305-18.91-32.77-18.91zM92.88 57.57v4.207h-4.207v4.203h4.207v4.207h4.203V65.98h4.203v-4.203h-4.203V57.57H92.88zm15.766 0v4.207h-4.204v4.203h4.204v4.207h4.207V65.98h4.203v-4.203h-4.203V57.57h-4.207z"
													/>
												</svg>
											) : (
												<svg viewBox="0 0 128 128">
													<title>c</title>
													<path
														fill="#659AD3"
														d="M115.4 30.7L67.1 2.9c-.8-.5-1.9-.7-3.1-.7-1.2 0-2.3.3-3.1.7l-48 27.9c-1.7 1-2.9 3.5-2.9 5.4v55.7c0 1.1.2 2.4 1 3.5l106.8-62c-.6-1.2-1.5-2.1-2.4-2.7z"
													/>
													<path
														fill="#03599C"
														d="M10.7 95.3c.5.8 1.2 1.5 1.9 1.9l48.2 27.9c.8.5 1.9.7 3.1.7 1.2 0 2.3-.3 3.1-.7l48-27.9c1.7-1 2.9-3.5 2.9-5.4V36.1c0-.9-.1-1.9-.6-2.8l-106.6 62z"
													/>
													<path
														fill="#fff"
														d="M85.3 76.1C81.1 83.5 73.1 88.5 64 88.5c-13.5 0-24.5-11-24.5-24.5s11-24.5 24.5-24.5c9.1 0 17.1 5 21.3 12.5l13-7.5c-6.8-11.9-19.6-20-34.3-20-21.8 0-39.5 17.7-39.5 39.5s17.7 39.5 39.5 39.5c14.6 0 27.4-8 34.2-19.8l-12.9-7.6z"
													/>
												</svg>
											)}
											{testBatch.name}
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
						<div className="h-[calc(100vh-140px)]">
							<div
								className={`mt-2 px-0.5 text-sm flex justify-between items-center  ${geistMono.className}`}
							>
								<p>Prolaznost:</p>
								<div className="font-bold flex items-center">
									<p className="text-green-400">
										{
											executionResults.filter(
												(result) => result.submissionStatus === 0,
											).length
										}
									</p>
									/
									<p className="text-yellow-400">
										{
											executionResults.filter(
												(result) => result.submissionStatus === 8,
											).length
										}
									</p>
									/
									<p className="text-red-400">
										{
											executionResults.filter(
												(result) =>
													result.submissionStatus !== 0 &&
													result.submissionStatus !== 8,
											).length
										}
									</p>
									/<p>{executionResults.length}</p>
								</div>
							</div>
							<ScrollArea className="h-[calc(100vh-140px)]">
								<div
									className={`flex flex-col gap-1.5 mt-2 ${geistMono.className}`}
								>
									{!loadingTestBatch
										? tests.map((test, i) => (
												<Dialog key={i}>
													<DialogTrigger asChild>
														<div
															key={i}
															className={`bg-[#16101d] group border-l-3 flex items-center justify-between cursor-pointer text-sm px-3 py-1 rounded ${
																executionResults.find(
																	(result) => result?.testId === test.id,
																)?.submissionStatus === 8
																	? "border-yellow-400"
																	: ""
															} ${
																executionResults.find(
																	(result) => result?.testId === test.id,
																)?.submissionStatus !== 0 &&
																executionResults.find(
																	(result) => result?.testId === test.id,
																)?.submissionStatus !== 8
																	? "border-red-400"
																	: ""
															} ${
																executionResults.find(
																	(result) => result?.testId === test.id,
																)?.submissionStatus === 0
																	? "border-green-400"
																	: ""
															}`}
														>
															Test {i + 1}
															<button
																className="cursor-pointer"
																type="button"
																onClick={(e) => {
																	e.preventDefault();
																	e.stopPropagation();
																	runTest(test.id);
																}}
															>
																{/* <LoaderCircle className="animate-spin w-4 h-4" /> */}
																<Play className="w-4 h-4 hidden group-hover:inline" />
																{executionResults.find(
																	(result) => result?.testId === test.id,
																)?.submissionStatus === 2 ? (
																	<Bug className="w-4 h-4 text-red-400 group-hover:hidden" />
																) : executionResults.find(
																		(result) => result?.testId === test.id,
																	)?.submissionStatus === 1 ? (
																	<AlertTriangle className="w-4 h-4 text-red-400 group-hover:hidden" />
																) : executionResults.find(
																		(result) => result?.testId === test.id,
																	)?.submissionStatus === 8 ? (
																	<Check className="w-4 h-4 text-yellow-400 group-hover:hidden" />
																) : (
																	<CheckCheck className="w-4 h-4 text-green-400 group-hover:hidden" />
																)}
															</button>
														</div>
													</DialogTrigger>
													<DialogContent className="sm:min-w-xl md:min-w-2xl lg:min-w-3xl xl:min-w-4xl">
														<DialogHeader>
															<DialogTitle>
																Test {i + 1} -{" "}
																{executionResults.find(
																	(result) => result?.testId === test.id,
																)?.description ?? "N/A"}
															</DialogTitle>
															<DialogDescription className="italic">
																Ako vam je test "Core Accepted", to znači da se
																vaš izlaz poklapa sa očekivanim kada bi se
																zanemarili svi blanko znakovi. Ovako prihvaćeni
																testovi često prolaze na Zamgeru.
															</DialogDescription>
														</DialogHeader>
														<div className="h-[calc(100dvh-200px)]">
															<ResizablePanelGroup direction="vertical">
																<ResizablePanel defaultSize={50} minSize={20}>
																	<div className="h-full">
																		<h4 className="text-sm font-bold mb-2">
																			Kod testa
																		</h4>
																		<Editor
																			value={`${test.code.topOfFile}\n// Vaš kod ide ovdje...\n${test.code.aboveMain}\nint main() {\n${test.code.main}\n}`}
																			theme="vs-dark"
																			language="cpp"
																			options={{
																				lineNumbers: "off",
																				readOnly: true,
																				minimap: { enabled: false },
																				fontFamily: "Geist Mono",
																				fontSize: 12,
																			}}
																		/>
																	</div>
																</ResizablePanel>
																<ResizableHandle />
																<ResizablePanel defaultSize={50} minSize={20}>
																	<ScrollArea className="h-full sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl">
																		<Table>
																			<TableBody>
																				<TableRow>
																					<TableCell className="text-xs font-medium w-[120px]">
																						Stdin
																					</TableCell>
																					<TableCell className="text-xs font-mono whitespace-pre-wrap min-w-[400px]">
																						{test.stdin || "(prazno)"}
																					</TableCell>
																				</TableRow>
																				<TableRow>
																					<TableCell className="text-xs font-medium w-[120px]">
																						Očekivani izlaz
																					</TableCell>
																					<TableCell className="text-xs font-mono whitespace-pre-wrap min-w-[400px]">
																						{test.expectedOutput.length > 0
																							? test.expectedOutput.map(
																									(output, index) => (
																										<div key={index}>
																											{output}
																											{index <
																												test.expectedOutput
																													.length -
																													1 && (
																												<Separator className="my-2" />
																											)}
																										</div>
																									),
																								)
																							: "(prazno)"}
																					</TableCell>
																				</TableRow>
																				<TableRow>
																					<TableCell className="text-xs font-medium w-[120px]">
																						Vaš izlaz
																					</TableCell>
																					<TableCell className="text-xs font-mono whitespace-pre-wrap min-w-[400px]">
																						{(() => {
																							const result =
																								executionResults.find(
																									(r) => r?.testId === test.id,
																								);
																							if (!result) return "N/A";

																							if (result.compileOutput) {
																								return (
																									<span className="text-red-400">
																										{result.compileOutput}
																									</span>
																								);
																							}

																							if (result.stderr) {
																								return (
																									<span className="text-red-400">
																										{result.stderr}
																									</span>
																								);
																							}

																							return result.stdout || "N/A";
																						})()}
																					</TableCell>
																				</TableRow>
																			</TableBody>
																		</Table>
																		<ScrollBar orientation="horizontal" />
																		<ScrollBar orientation="vertical" />
																	</ScrollArea>
																</ResizablePanel>
															</ResizablePanelGroup>
														</div>
													</DialogContent>
												</Dialog>
											))
										: [...Array(5)].map((_, i) => (
												<Skeleton key={i} className="h-7 w-full rounded" />
											))}
								</div>
							</ScrollArea>
						</div>
					</ResizablePanel>
				</ResizablePanelGroup>
			</SidebarInset>
		</SidebarProvider>
	);
}
