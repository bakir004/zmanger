/* eslint-disable */
import { Editor, EditorProps } from "@monaco-editor/react";
import { useTheme } from "next-themes";

export default function MonacoCodeEditor({
  readonly,
  language,
  onChange,
  value,
  ...editorProps
}: {
  readonly?: boolean;
  language: "json" | "cpp";
  onChange?: (val: string) => void;
  value: string;
} & EditorProps) {
  const { theme } = useTheme();

  const editorTheme = theme === "dark" ? "vs-dark" : "vs-light";
  return (
    <Editor
      value={value}
      theme={editorTheme}
      language={language}
      onChange={onChange}
      options={{
        readOnly: true,
        minimap: { enabled: false },
        lineDecorationsWidth: 0,
        folding: false,
        scrollBeyondLastLine: false,
        guides: {
          indentation: false,
        },
        stickyScroll: {
          enabled: false,
        },
      }}
      {...editorProps}
    />
  );
}
