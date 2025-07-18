import type React from "react";
import { Skeleton } from "app/_components/ui/skeleton";
import { TestDialog } from "./test-dialog";
import { geistMono } from "app/_fonts/fonts";
import type { Test } from "~/entities/models/test";
import type { ExecutionResultWithTestId } from "~/entities/models/execution-result";

interface TestListProps {
	tests: Test[];
	executionResults: ExecutionResultWithTestId[];
	loadingTestBatch: boolean;
	runTest: (testId: number) => void;
}

export const TestList: React.FC<TestListProps> = ({
	tests,
	executionResults,
	loadingTestBatch,
	runTest,
}) => (
	<div className={`flex flex-col gap-1.5 mt-2 ${geistMono.className}`}>
		{!loadingTestBatch
			? tests.map((test, i) => (
					<TestDialog
						key={i}
						test={test}
						result={executionResults.find((r) => r?.testId === test.id)}
						index={i}
						runTest={runTest}
					/>
				))
			: [...Array(5)].map((_, i) => (
					<Skeleton key={i} className="h-7 w-full rounded" />
				))}
	</div>
);
