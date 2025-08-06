import Editor from "@monaco-editor/react";
import type { Dispatch, SetStateAction } from "react";

interface EditorMainProps {
	code: string;
	setCode: Dispatch<SetStateAction<string>>;
}

export function EditorMain({ code, setCode }: EditorMainProps) {
	return (
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
	);
}
