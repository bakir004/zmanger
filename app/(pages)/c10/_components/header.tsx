import type { ReactNode } from "react";
import { SidebarTrigger } from "app/_components/ui/sidebar";
import { Separator } from "app/_components/ui/separator";
import { ButtonRunCode } from "./button-run-code";
import { ButtonRunAllTests } from "./button-run-all-tests";
import { ButtonSaveCode } from "./button-save-code";

interface HeaderProps {
	run: () => void;
	runAllTests: () => void;
	handleSave: () => void;
	loading: boolean;
	savingFile: boolean;
	testsLength: number;
	children?: ReactNode;
}

export function Header({
	run,
	runAllTests,
	handleSave,
	loading,
	savingFile,
	testsLength,
	children,
}: HeaderProps) {
	return (
		<header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-transparent">
			<SidebarTrigger className="-ml-1" />
			<Separator
				orientation="vertical"
				className="mr-2 data-[orientation=vertical]:h-4"
			/>
			<ButtonRunCode onClick={run} disabled={loading} loading={loading} />
			<ButtonRunAllTests
				onClick={runAllTests}
				disabled={loading || testsLength === 0}
				loading={loading}
			/>
			<ButtonSaveCode
				onClick={handleSave}
				disabled={savingFile}
				savingFile={savingFile}
			/>
			{children}
		</header>
	);
}
