import Editor from "@monaco-editor/react";
import { LoaderCircle, Check, X } from "lucide-react";
import { geistMono } from "app/_fonts/fonts";

interface EditorStdoutProps {
	stdout: string;
	loading: boolean;
}

export function EditorStdout({ stdout, loading }: EditorStdoutProps) {
	return (
		<>
			<div
				className={`text-sm py-1 px-2 bg-transparent flex items-center gap-2 ${geistMono.className}`}
			>
				stdout
				{loading && <LoaderCircle className={"w-4 h-4 animate-spin"} />}
				{!loading && <Check className="w-4 h-4 text-green-400" />}
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
		</>
	);
}
