import type React from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableRow,
} from "app/_components/ui/table";
import { Separator } from "app/_components/ui/separator";
import type { Test } from "~/entities/models/test";
import type { ExecutionResultWithTestId } from "~/entities/models/execution-result";

interface TestDialogTableProps {
	test: Test;
	result: ExecutionResultWithTestId | undefined;
}

export const TestDialogTable: React.FC<TestDialogTableProps> = ({
	test,
	result,
}) => (
	<Table>
		<TableBody>
			<TableRow>
				<TableCell className="text-xs font-medium w-[120px]">Stdin</TableCell>
				<TableCell className="text-xs font-mono whitespace-pre-wrap min-w-[400px]">
					{test.stdin}
				</TableCell>
			</TableRow>
			<TableRow>
				<TableCell className="text-xs font-medium w-[120px]">
					Očekivani izlaz
				</TableCell>
				<TableCell className="text-xs font-mono whitespace-pre-wrap min-w-[400px]">
					{test.expectedOutput.length > 0
						? test.expectedOutput.map((output, idx) => (
								<div key={idx}>
									{output}
									{idx < test.expectedOutput.length - 1 && (
										<Separator className="my-2" />
									)}
								</div>
							))
						: "⚠️ Ovaj test nema očekivani izlaz ⚠️"}
				</TableCell>
			</TableRow>
			<TableRow>
				<TableCell className="text-xs font-medium w-[120px]">
					Vaš izlaz
				</TableCell>
				<TableCell className="text-xs font-mono whitespace-pre-wrap min-w-[400px]">
					{(() => {
						if (!result) return "N/A";
						if (result.compileOutput) {
							return (
								<span className="text-red-400">{result.compileOutput}</span>
							);
						}
						if (result.stderr) {
							return <span className="text-red-400">{result.stderr}</span>;
						}
						return result.stdout || "N/A";
					})()}
				</TableCell>
			</TableRow>
			<TableRow>
				<TableCell className="text-xs font-medium w-[120px]">
					Vrijeme izvršavanja
				</TableCell>
				<TableCell className="text-xs font-mono whitespace-pre-wrap min-w-[400px]">
					{result?.time ? `${result.time / 1000} ms` : "N/A"}
				</TableCell>
			</TableRow>
		</TableBody>
	</Table>
);
