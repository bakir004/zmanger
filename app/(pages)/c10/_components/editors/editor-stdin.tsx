import Editor from "@monaco-editor/react";
import { geistMono } from "app/_fonts/fonts";
import type { Dispatch, SetStateAction } from "react";

interface EditorStdinProps {
	stdin: string;
	setStdin: Dispatch<SetStateAction<string>>;
}

export function EditorStdin({ stdin, setStdin }: EditorStdinProps) {
	return (
		<>
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
		</>
	);
}
