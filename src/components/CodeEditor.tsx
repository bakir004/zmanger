/* eslint-disable */
"use client";
import CodeMirror, { type ReactCodeMirrorProps } from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { json } from "@codemirror/lang-json";
import { vscodeDark, vscodeLight } from "@uiw/codemirror-theme-vscode";
import { useTheme } from "next-themes";
import { EditorView } from "@codemirror/view";

export default function CodeEditor({
  readonly,
  language,
  onChange,
  value,
  ...codeMirrorProps
}: {
  readonly?: boolean;
  language: "json" | "cpp";
  onChange?: (val: string) => void;
  value: string;
} & ReactCodeMirrorProps) {
  const { theme } = useTheme();

  const codeMirrorTheme = theme === "dark" ? vscodeDark : vscodeLight;
  return (
    <CodeMirror
      value={value}
      {...codeMirrorProps}
      extensions={[
        language === "cpp" ? cpp() : json(),
        EditorView.editable.of(!readonly),
      ]}
      onChange={onChange}
      theme={codeMirrorTheme}
    />
  );
}
