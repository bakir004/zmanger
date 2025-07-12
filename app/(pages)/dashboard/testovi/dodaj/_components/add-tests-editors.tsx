"use client";

import { Editor } from "@monaco-editor/react";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "app/_components/ui/resizable";
import type { Test } from "../_utils/formatter";
import { useCallback, useRef, useEffect, useState } from "react";

export default function AddTestsEditors({
	test,
	onTestUpdate,
}: {
	test: Test;
	onTestUpdate: (testId: number, updatedTest: Test) => void;
}) {
	const currentTestRef = useRef<Test>(test);

	useEffect(() => {
		currentTestRef.current = test;
	}, [test]);

	const handleTopOfFileChange = useCallback(
		(value: string | undefined) => {
			const updatedTest = {
				...currentTestRef.current,
				code: {
					...currentTestRef.current.code,
					topOfFile: value || "",
				},
			};
			onTestUpdate(currentTestRef.current.id, updatedTest);
		},
		[onTestUpdate],
	);

	const handleAboveMainChange = useCallback(
		(value: string | undefined) => {
			const updatedTest = {
				...currentTestRef.current,
				code: {
					...currentTestRef.current.code,
					aboveMain: value || "",
				},
			};
			onTestUpdate(currentTestRef.current.id, updatedTest);
		},
		[onTestUpdate],
	);

	const handleMainChange = useCallback(
		(value: string | undefined) => {
			const updatedTest = {
				...currentTestRef.current,
				code: {
					...currentTestRef.current.code,
					main: value || "",
				},
			};
			onTestUpdate(currentTestRef.current.id, updatedTest);
		},
		[onTestUpdate],
	);

	const handleStdinChange = useCallback(
		(value: string | undefined) => {
			const updatedTest = {
				...currentTestRef.current,
				stdin: value || "",
			};
			onTestUpdate(currentTestRef.current.id, updatedTest);
		},
		[onTestUpdate],
	);

	const [validJson, setValidJson] = useState(true);

	const handleExpectedOutputChange = useCallback(
		(value: string | undefined) => {
			try {
				const parsedOutput = value ? JSON.parse(value) : [];
				const updatedTest = {
					...currentTestRef.current,
					expectedOutput: Array.isArray(parsedOutput) ? parsedOutput : [],
				};
				onTestUpdate(currentTestRef.current.id, updatedTest);
				setValidJson(true);
			} catch (error) {
				setValidJson(false);
			}
		},
		[onTestUpdate],
	);

	return (
		<ResizablePanelGroup
			direction="vertical"
			className="max-w-[calc(100dvw)] md:max-w-[calc(100dvw-320px)]"
		>
			<ResizablePanel defaultSize={20}>
				<ResizablePanelGroup direction="horizontal">
					<ResizablePanel defaultSize={50}>
						<p className="font-semibold mb-1">Vrh fajla (top_of_file)</p>
						<Editor
							value={test.code.topOfFile}
							language="cpp"
							theme="vs-dark"
							onChange={handleTopOfFileChange}
							options={{
								fontFamily: "Geist Mono",
								minimap: { enabled: false },
							}}
						/>
					</ResizablePanel>
					<ResizableHandle />
					<ResizablePanel defaultSize={50}>
						<p className="font-semibold mb-1 ml-4">Iznad maina (above_main)</p>
						<Editor
							value={test.code.aboveMain}
							theme="vs-dark"
							language="cpp"
							onChange={handleAboveMainChange}
							options={{
								fontFamily: "Geist Mono",
								minimap: { enabled: false },
							}}
						/>
					</ResizablePanel>
				</ResizablePanelGroup>
			</ResizablePanel>
			<ResizableHandle />
			<ResizablePanel defaultSize={80}>
				<ResizablePanelGroup direction="vertical">
					<ResizablePanel defaultSize={60} minSize={10}>
						<p className="font-semibold my-1">
							Unutar maina (main)
							{test.code.main === "" && <span className="text-red-400">*</span>}
						</p>
						<Editor
							value={test.code.main}
							theme="vs-dark"
							language="cpp"
							onChange={handleMainChange}
							options={{
								fontFamily: "Geist Mono",
								minimap: { enabled: false },
							}}
						/>
					</ResizablePanel>
					<ResizableHandle />
					<ResizablePanel defaultSize={40} minSize={10}>
						<ResizablePanelGroup direction="horizontal">
							<ResizablePanel defaultSize={50}>
								<p className="font-semibold my-1">Stdin (txt)</p>
								<Editor
									value={test.stdin}
									language="cpp"
									theme="vs-dark"
									onChange={handleStdinChange}
									options={{
										fontFamily: "Geist Mono",
										minimap: { enabled: false },
									}}
								/>
							</ResizablePanel>
							<ResizableHandle />
							<ResizablePanel defaultSize={50}>
								<p className="font-semibold my-1 ml-4">
									Očekivani izlaz (JSON niz stringova)
									{test.expectedOutput.length < 1 && (
										<span className="text-red-400">*</span>
									)}
									{!validJson && (
										<span className="text-red-400 text-xs italic">
											Nije validan JSON
										</span>
									)}
								</p>
								<Editor
									value={`[${test ? test.expectedOutput.map((item) => JSON.stringify(item)).join(",") : ""}]`}
									theme="vs-dark"
									language="cpp"
									onChange={handleExpectedOutputChange}
									options={{
										fontFamily: "Geist Mono",
										minimap: { enabled: false },
									}}
								/>
							</ResizablePanel>
						</ResizablePanelGroup>
					</ResizablePanel>
				</ResizablePanelGroup>
			</ResizablePanel>
		</ResizablePanelGroup>
	);
}
