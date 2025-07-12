"use client";

import { FileSidebar } from "app/_components/file-sidebar";
import { Separator } from "app/_components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "app/_components/ui/sidebar";

import Editor from "@monaco-editor/react";
import { Check, LoaderCircle, Play, X } from "lucide-react";
import code from "app/_fonts/code";
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
import { useState } from "react";
import { Button } from "app/_components/ui/button";
import { runTests } from "./actions";

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

	const [loading, setLoading] = useState(false);

	const run = async () => {
		setLoading(true);
		setOutputMessage("");
		const results = await runTests({ code, stdin, stdout, language });
		if (results.compile_output) {
			setStdout(results.compile_output);
			setOutputMessage(results.description);
			setPingFail(true);
			setTimeout(() => {
				setPingFail(false);
			}, 900);
		} else if (results.stderr) {
			setStdout(results.stderr);
			setOutputMessage(results.description);
			setPingFail(true);
			setTimeout(() => {
				setPingFail(false);
			}, 900);
		} else {
			setStdout(results.stdout);
			setPingSuccess(true);
			setTimeout(() => {
				setPingSuccess(false);
			}, 900);
		}
		setLoading(false);
	};

	return (
		<SidebarProvider>
			<FileSidebar />
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
						className="flex bg-gradient-to-br items-center gap-2 cursor-pointer to-[#e38b6c] from-[#e7b771]"
					>
						{loading ? (
							<>
								<LoaderCircle className="animate-spin" />
								Pokrećem
							</>
						) : (
							<>
								<Play />
								Pokreni
							</>
						)}
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
						<Select>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Izaberite testove" />
							</SelectTrigger>
							<SelectContent className="-mr-1">
								<SelectGroup>
									<SelectLabel>TP Zadaca 1</SelectLabel>
									<SelectItem value="apple">Zadatak 1.1</SelectItem>
									<SelectItem value="banana">Zadatak 1.2</SelectItem>
									<SelectItem value="blueberry">Zadatak 1.3</SelectItem>
									<SelectItem value="grapes">Zadatak 1.4</SelectItem>
								</SelectGroup>
								<SelectGroup>
									<SelectLabel>TP Zadaca 2</SelectLabel>
									<SelectItem value="apple1">Zadatak 2.1</SelectItem>
									<SelectItem value="b1anana">Zadatak 2.2</SelectItem>
									<SelectItem value="bl1ueberry">Zadatak 2.3</SelectItem>
									<SelectItem value="gra1pes">Zadatak 2.4</SelectItem>
									<SelectItem value="pine1apple">Zadatak 2.5</SelectItem>
									<SelectLabel>ASP</SelectLabel>
									<SelectItem value="asdas">PZ1</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
						<div
							className={`mt-2 text-sm flex justify-between items-center  ${geistMono.className}`}
						>
							<p>Prolaznost:</p>
							<div className="font-bold flex items-center">
								<p className="text-green-400">4</p>/
								<p className="text-yellow-400">0</p>/
								<p className="text-red-400">6</p>/<p>10</p>
							</div>
						</div>
						<div
							className={`flex flex-col gap-1.5 mt-2  ${geistMono.className}`}
						>
							{[...Array(5)].map((item, i) => (
								<div
									key={i}
									className="bg-[#16101d] border-l-3 border-neutral-400 flex items-center justify-between cursor-pointer text-sm px-3 py-1 rounded"
								>
									Test {i + 1}
									<div>
										{/* <LoaderCircle className="animate-spin w-4 h-4" /> */}
										<Play className="w-4 h-4" />
									</div>
								</div>
							))}
						</div>
					</ResizablePanel>
				</ResizablePanelGroup>
			</SidebarInset>
		</SidebarProvider>
	);
}
