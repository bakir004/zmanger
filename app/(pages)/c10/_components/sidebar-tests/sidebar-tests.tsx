import type React from "react";
import {
	Select,
	SelectLabel,
	SelectContent,
	SelectGroup,
	SelectTrigger,
	SelectItem,
	SelectValue,
} from "app/_components/ui/select";
import { Separator } from "app/_components/ui/separator";
import { geistMono } from "app/_fonts/fonts";
import { ScrollArea, ScrollBar } from "app/_components/ui/scroll-area";
import {
	Table,
	TableBody,
	TableCell,
	TableRow,
} from "app/_components/ui/table";
import { Skeleton } from "app/_components/ui/skeleton";
import {
	Dialog,
	DialogTitle,
	DialogHeader,
	DialogContent,
	DialogTrigger,
	DialogDescription,
} from "app/_components/ui/dialog";
import {
	ResizablePanelGroup,
	ResizablePanel,
	ResizableHandle,
} from "app/_components/ui/resizable";
import { Play, Bug, AlertTriangle, Check, CheckCheck } from "lucide-react";
import Editor from "@monaco-editor/react";
import type { Test } from "~/entities/models/test";
import type { ExecutionResultWithTestId } from "~/entities/models/execution-result";
import { TestBatchSelect } from "./test-batch-select";
import { SubmissionStatus } from "~/entities/models/submission-status";
import { ResultsOverview } from "./results-overview";
import { TestDialog } from "./test-dialog";
import { TestList } from "./test-list";

interface SidebarTestsProps {
	handleTestBatchChange: (value: string) => void;
	loadingTestBatch: boolean;
	tests: Test[];
	executionResults: ExecutionResultWithTestId[];
	runTest: (testId: number) => Promise<any>;
}

export const SidebarTests: React.FC<SidebarTestsProps> = ({
	handleTestBatchChange,
	loadingTestBatch,
	tests,
	executionResults,
	runTest,
}) => {
	return (
		<>
			<TestBatchSelect handleTestBatchChange={handleTestBatchChange} />
			<ScrollArea className="h-[calc(100vh-120px)]">
				<ResultsOverview executionResults={executionResults} />
				<TestList
					tests={tests}
					executionResults={executionResults}
					loadingTestBatch={loadingTestBatch}
					runTest={runTest}
				/>
			</ScrollArea>
		</>
	);
};
