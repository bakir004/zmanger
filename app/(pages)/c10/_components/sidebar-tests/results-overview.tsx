import { geistMono } from "app/_fonts/fonts";
import { Badge } from "app/_components/ui/badge";
import type React from "react";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "app/_components/ui/tooltip";
import type { ExecutionResultWithTestId } from "~/entities/models/execution-result";
import { SubmissionStatus } from "~/entities/models/submission-status";

interface ResultsOverviewProps {
	executionResults: ExecutionResultWithTestId[];
}

export const ResultsOverview: React.FC<ResultsOverviewProps> = ({
	executionResults,
}) => {
	const acceptedTests = executionResults.filter(
		(result) => result.submissionStatus === SubmissionStatus.Accepted,
	).length;
	const coreAcceptedTests = executionResults.filter(
		(result) => result.submissionStatus === SubmissionStatus.CoreAccepted,
	).length;
	const wrongAnswerTests = executionResults.filter(
		(result) => result.submissionStatus === SubmissionStatus.WrongAnswer,
	).length;
	const totalTests = executionResults.length;
	return (
		<div
			className={`mt-2 px-0.5 text-sm flex justify-between items-center ${geistMono.className}`}
		>
			<p>Prolaznost:</p>
			<div className="font-bold flex gap-1 items-center">
				<Tooltip>
					<TooltipTrigger>
						<Badge className="px-0.5 py-0 bg-green-400 text-green-900">
							{acceptedTests}
						</Badge>
					</TooltipTrigger>
					<TooltipContent>Broj prihvaćenih testova</TooltipContent>
				</Tooltip>
				<Tooltip>
					<TooltipTrigger>
						<Badge className="px-0.5 py-0 bg-yellow-400 text-yellow-900">
							{coreAcceptedTests}
						</Badge>
					</TooltipTrigger>
					<TooltipContent>Broj možda prihvaćenih testova</TooltipContent>
				</Tooltip>
				<Tooltip>
					<TooltipTrigger>
						<Badge className="px-0.5 py-0 bg-red-400 text-red-900">
							{wrongAnswerTests}
						</Badge>
					</TooltipTrigger>
					<TooltipContent>Broj neispravnih testova</TooltipContent>
				</Tooltip>
				<Tooltip>
					<TooltipTrigger>
						<Badge className="px-0.5 py-0 bg-gray-400 text-gray-900">
							{totalTests}
						</Badge>
					</TooltipTrigger>
					<TooltipContent>Ukupan broj testova</TooltipContent>
				</Tooltip>
			</div>
		</div>
	);
};
