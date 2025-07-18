import type React from "react";
import {
	Play,
	Bug,
	AlertTriangle,
	Check,
	CheckCheck,
	DatabaseZap,
	Droplets,
	ClockAlert,
} from "lucide-react";
import { DialogTrigger } from "app/_components/ui/dialog";
import clsx from "clsx";
import { SubmissionStatus } from "~/entities/models/submission-status";

interface TestListElementProps {
	status: number | undefined;
	onRun: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
	children: React.ReactNode;
}

const statusToBorderColor = (status: number | undefined) => {
	switch (status) {
		case SubmissionStatus.Accepted:
			return "border-green-400";
		case SubmissionStatus.CoreAccepted:
			return "border-yellow-400";
		case SubmissionStatus.WrongAnswer:
		case SubmissionStatus.RuntimeError:
		case SubmissionStatus.TimeLimitExceeded:
		case SubmissionStatus.MemoryLimitExceeded:
		case SubmissionStatus.MemoryLeakDetected:
		case SubmissionStatus.MemoryError:
		case SubmissionStatus.CompilationError:
			return "border-red-400";
		default:
			return "border-gray-400";
	}
};

const statusToIcon = (status: number | undefined) => {
	switch (status) {
		case SubmissionStatus.Accepted:
			return (
				<CheckCheck className="w-4 h-4 text-green-400 group-hover:hidden" />
			);
		case SubmissionStatus.CoreAccepted:
			return <Check className="w-4 h-4 text-yellow-400 group-hover:hidden" />;
		case SubmissionStatus.RuntimeError:
		case SubmissionStatus.WrongAnswer:
			return (
				<AlertTriangle className="w-4 h-4 text-red-400 group-hover:hidden" />
			);
		case SubmissionStatus.CompilationError:
			return <Bug className="w-4 h-4 text-red-400 group-hover:hidden" />;
		case SubmissionStatus.TimeLimitExceeded:
			return <ClockAlert className="w-4 h-4 text-red-400 group-hover:hidden" />;
		case SubmissionStatus.MemoryError:
		case SubmissionStatus.MemoryLimitExceeded:
			return (
				<DatabaseZap className="w-4 h-4 text-red-400 group-hover:hidden" />
			);
		case SubmissionStatus.MemoryLeakDetected:
			return <Droplets className="w-4 h-4 text-red-400 group-hover:hidden" />;
	}
};

export const TestListElement: React.FC<TestListElementProps> = ({
	status,
	onRun,
	children,
}) => (
	<DialogTrigger asChild>
		<div
			className={clsx(
				"bg-muted/20 group border-l-3 flex items-center justify-between cursor-pointer text-sm px-3 py-1 rounded",
				statusToBorderColor(status),
			)}
		>
			{children}
			<button
				className="cursor-pointer"
				type="button"
				onClick={(e) => {
					e.stopPropagation();
					e.preventDefault();
					onRun(e);
				}}
			>
				{/* <LoaderCircle className="animate-spin w-4 h-4" /> */}
				<Play className="w-4 h-4 hidden group-hover:inline" />
				{statusToIcon(status)}
			</button>
		</div>
	</DialogTrigger>
);
