import { useEffect } from "react";
import { FileSidebar } from "../../_components/file-sidebar";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "../../_components/ui/breadcrumb";
import { Separator } from "../../_components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "../../_components/ui/sidebar";

import Editor from "@monaco-editor/react";
import { LoaderCircle, Play, X } from "lucide-react";
import code from "fonts/code";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "_components/ui/resizable";
import {
	Select,
	SelectLabel,
	SelectContent,
	SelectGroup,
	SelectTrigger,
	SelectItem,
	SelectValue,
} from "_components/ui/select";
import { geistMono } from "fonts/fonts";

export default function Page() {
	return (
		<SidebarProvider>
			<FileSidebar />
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
					<SidebarTrigger className="-ml-1" />
					<Separator
						orientation="vertical"
						className="mr-2 data-[orientation=vertical]:h-4"
					/>
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem className="hidden md:block">
								<BreadcrumbLink href="#">components</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator className="hidden md:block" />
							<BreadcrumbItem className="hidden md:block">
								<BreadcrumbLink href="#">ui</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator className="hidden md:block" />
							<BreadcrumbItem>
								<BreadcrumbPage>button.tsx</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</header>

				<ResizablePanelGroup direction="horizontal">
					<ResizablePanel>
						<ResizablePanelGroup
							direction="vertical"
							className="h-[calc(100vh-96px)]"
						>
							<ResizablePanel>
								<div className="h-8 w-full flex items-center">
									<div className="flex h-full items-center gap-1 px-2 cursor-pointer text-xs border-r">
										<img
											className="w-3 h-3"
											alt="cpp"
											src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-plain.svg"
										/>
										main.cpp
										{/* <X className="w-3 h-3 mt-0.5" /> */}
									</div>
									<div className="flex h-full items-center gap-1 px-2 bg-[#18181b] cursor-pointer text-xs">
										<img
											className="w-3 h-3"
											alt="c"
											src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/c/c-plain.svg"
										/>{" "}
										main.c
										<X className="w-3 h-3 mt-0.5 hover:text-red-400" />
									</div>
								</div>
								<div className="h-full">
									<Editor
										value={code}
										theme="vs-dark"
										language="cpp"
										options={{
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
											className={`text-sm py-1 px-2 bg-[#18181b] font-mono  ${geistMono.className}`}
										>
											stdin
										</div>
										<Editor
											value={"input"}
											theme="vs-dark"
											options={{
												lineNumbers: "off",
												minimap: { enabled: false },
											}}
										/>
									</ResizablePanel>
									<ResizableHandle />
									<ResizablePanel>
										<div
											className={`text-sm py-1 px-2 bg-[#18181b] ${geistMono.className}`}
										>
											stdout
										</div>
										<Editor
											value={"input"}
											theme="vs-dark"
											options={{
												lineNumbers: "off",
												minimap: { enabled: false },
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
						className="bg-[#18181b] p-2"
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
									className="bg-[#222226] border-l-3 border-neutral-400 flex items-center justify-between cursor-pointer text-sm px-3 py-1 rounded"
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
