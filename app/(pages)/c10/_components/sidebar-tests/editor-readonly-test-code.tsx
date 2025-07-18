import type React from "react";
import type { Test } from "~/entities/models/test";
import hljs from "highlight.js/lib/core";
import { useEffect } from "react";
import cpp from "highlight.js/lib/languages/cpp";
import "highlight.js/styles/base16/ros-pine.css";
import { ScrollArea } from "app/_components/ui/scroll-area";

hljs.registerLanguage("cpp", cpp);

interface EditorReadonlyTestCodeProps {
	test: Test;
}

export const EditorReadonlyTestCode: React.FC<EditorReadonlyTestCodeProps> = ({
	test,
}) => {
	useEffect(() => {
		hljs.highlightAll();
	}, []);
	return (
		<>
			<h4 className="text-sm font-bold mb-2">Kod testa</h4>
			<ScrollArea className="h-full">
				<pre>
					<code className="language-cpp text-xs">
						{`${test.code.topOfFile}\n// Vaš kod ide ovdje...\n${test.code.aboveMain}\nint main() {\n${test.code.main}\n}`}
					</code>
				</pre>
			</ScrollArea>
		</>
	);
};
