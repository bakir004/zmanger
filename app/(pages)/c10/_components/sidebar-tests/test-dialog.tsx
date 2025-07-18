import type React from "react";
import {
	Dialog,
	DialogTitle,
	DialogHeader,
	DialogContent,
	DialogDescription,
} from "app/_components/ui/dialog";
import {
	ResizablePanelGroup,
	ResizablePanel,
	ResizableHandle,
} from "app/_components/ui/resizable";
import { ScrollArea, ScrollBar } from "app/_components/ui/scroll-area";
import type { Test } from "~/entities/models/test";
import type { ExecutionResultWithTestId } from "~/entities/models/execution-result";
import { TestListElement } from "./test-list-element";
import { EditorReadonlyTestCode } from "./editor-readonly-test-code";
import { TestDialogTable } from "./test-dialog-table";

interface TestDialogProps {
	test: Test;
	result: ExecutionResultWithTestId | undefined;
	index: number;
	runTest: (testId: number) => void;
}

export const TestDialog: React.FC<TestDialogProps> = ({
	test,
	result,
	index,
	runTest,
}) => {
	return (
		<Dialog>
			<TestListElement
				status={result?.submissionStatus}
				onRun={() => runTest(test.id)}
			>
				Test {index + 1}
			</TestListElement>
			<DialogContent className="h-screen min-w-full w-screen flex flex-col">
				<DialogHeader>
					<DialogTitle>
						Test {index + 1} - {result?.description ?? "N/A"}
					</DialogTitle>
					<DialogDescription className="italic">
						Ako vam je test "Core Accepted", to znači da se vaš izlaz poklapa sa
						očekivanim kada bi se zanemarili svi blanko znakovi. Ovako
						prihvaćeni testovi često prolaze na Zamgeru.
					</DialogDescription>
				</DialogHeader>
				<ResizablePanelGroup direction="vertical">
					<ResizablePanel defaultSize={60} minSize={20}>
						<EditorReadonlyTestCode test={test} />
					</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel defaultSize={40} minSize={20}>
						<ScrollArea className="h-full w-[calc(100vw-50px)]">
							<TestDialogTable test={test} result={result} />
							<ScrollBar orientation="horizontal" />
							<ScrollBar orientation="vertical" />
						</ScrollArea>
					</ResizablePanel>
				</ResizablePanelGroup>
			</DialogContent>
		</Dialog>
	);
};
