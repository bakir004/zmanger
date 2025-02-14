"use client";
import CodeMirror from "@uiw/react-codemirror";
import { useCallback, useState } from "react";
import { cpp } from "@codemirror/lang-cpp";
import { json } from "@codemirror/lang-json";
import { vscodeDark, vscodeLight } from "@uiw/codemirror-theme-vscode";
import { useTheme } from "next-themes";
import { EditorView } from "@codemirror/view";

export default function CodeEditor({
  initCode,
  readonly,
  language,
}: {
  initCode?: string;
  readonly?: boolean;
  language: "json" | "cpp";
}) {
  const { theme } = useTheme();
  const [value, setValue] = useState(
    initCode ??
      '// Nemojte ovdje kodirati, vas kod nece biti spasen...\n#include <iostream>\nint main(){\n  std::cout << "Hello, World!" << std::endl;\n  return 0;\n}',
  );
  const onChange = useCallback((val: string) => {
    setValue(val);
  }, []);
  const codeMirrorTheme = theme === "dark" ? vscodeDark : vscodeLight;
  return (
    <CodeMirror
      value={value}
      height="100%"
      extensions={[
        language === "cpp" ? cpp() : json(),
        EditorView.editable.of(!readonly),
      ]}
      onChange={onChange}
      theme={codeMirrorTheme}
    />
  );
}
