"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "app/_components/ui/card";
import { Badge } from "app/_components/ui/badge";
import { Button } from "app/_components/ui/button";
import {
	CheckCircle2,
	XCircle,
	Clock,
	Trophy,
	BookOpen,
	RefreshCw,
	Loader2,
	CheckCircle,
} from "lucide-react";
import { useUserSubmissionsOverview } from "../hooks/use-user-submissions-overview";
import Link from "next/link";
import type { UserSubmissionOverview } from "~/entities/models/user-submission";

function SubmissionCard({
	submission,
}: { submission: UserSubmissionOverview }) {
	const successRate =
		submission.totalTests > 0
			? Math.round((submission.successfulTests / submission.totalTests) * 100)
			: 0;

	const getSuccessRateColor = (rate: number) => {
		if (rate >= 80) return "text-green-600 bg-green-50";
		if (rate >= 60) return "text-yellow-600 bg-yellow-50";
		return "text-red-600 bg-red-50";
	};

	const getSuccessRateIcon = (rate: number) => {
		if (rate >= 80) return <Trophy className="h-4 w-4" />;
		if (rate >= 60) return <Clock className="h-4 w-4" />;
		return <XCircle className="h-4 w-4" />;
	};

	return (
		<Card className="hover:shadow-md transition-shadow cursor-pointer">
			<CardHeader className="pb-3">
				<div className="flex items-start justify-between">
					<div className="space-y-1">
						<CardTitle className="text-lg font-semibold">
							{submission.testBatchName}
						</CardTitle>
						<CardDescription className="text-sm text-muted-foreground">
							Zadnji put predano:{" "}
							{new Date(submission.updatedAt).toLocaleDateString("sr-Latn-RS", {
								day: "2-digit",
								month: "2-digit",
								year: "numeric",
								hour: "2-digit",
								minute: "2-digit",
							})}
						</CardDescription>
					</div>
					<Badge
						className={`${getSuccessRateColor(successRate)} bg-transparent border-0`}
					>
						<div className="flex items-center gap-1">
							{getSuccessRateIcon(successRate)}
							{successRate}%
						</div>
					</Badge>
				</div>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{/* Progress Bar */}
					<div className="space-y-2">
						<div className="flex justify-between text-sm">
							<span className="text-muted-foreground">Uspješnost</span>
							<span className="font-medium">
								{submission.successfulTests}/{submission.totalTests} testova
							</span>
						</div>
						<div className="w-full bg-muted rounded-full h-2 overflow-hidden">
							<div
								className={`h-2 rounded-full transition-all duration-300 ${
									successRate >= 80
										? "bg-green-500"
										: successRate >= 60
											? "bg-yellow-500"
											: "bg-red-500"
								}`}
								style={{ width: `${successRate}%` }}
							/>
						</div>
					</div>

					{/* Stats */}
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<div className="flex items-center gap-2 text-sm">
								<CheckCircle2 className="h-4 w-4 text-green-500" />
								<span className="text-muted-foreground">Prihvaćeno:</span>
								<span className="font-medium text-green-600">
									{submission.acceptedTests}
								</span>
							</div>
							<div className="flex items-center gap-2 text-sm">
								<CheckCircle className="h-4 w-4 text-yellow-500" />
								<span className="text-muted-foreground">Djelomično:</span>
								<span className="font-medium text-yellow-500">
									{submission.coreAcceptedTests}
								</span>
							</div>
						</div>
						<div className="flex items-center gap-2 text-sm">
							<XCircle className="h-4 w-4 text-red-500" />
							<span className="text-muted-foreground">Palo:</span>
							<span className="font-medium text-red-600">
								{submission.failedTests}
							</span>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

export function UserSubmissionsOverview() {
	const {
		data: submissions,
		isLoading,
		error,
		refetch,
		isRefetching,
	} = useUserSubmissionsOverview();

	if (error) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-red-600">
						<XCircle className="h-5 w-5" />
						Greška pri učitavanju
					</CardTitle>
					<CardDescription>
						Došlo je do greške pri učitavanju vaših predaja. Molimo pokušajte
						ponovo.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Button
						variant="outline"
						onClick={() => refetch()}
						disabled={isRefetching}
					>
						<RefreshCw
							className={`h-4 w-4 mr-2 ${isRefetching ? "animate-spin" : ""}`}
						/>
						Pokušaj ponovo
					</Button>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle className="flex items-center gap-2 mb-2">
							<BookOpen className="h-5 w-5" />
							Moje predaje
						</CardTitle>
						<CardDescription>
							Pregled vaših predaja testova i rezultata
						</CardDescription>
					</div>
					<Button
						variant="outline"
						size="sm"
						onClick={() => refetch()}
						disabled={isLoading || isRefetching}
					>
						<RefreshCw
							className={`h-4 w-4 mr-2 ${isLoading || isRefetching ? "animate-spin" : ""}`}
						/>
						Osvježi
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<div className="flex items-center justify-center py-8">
						<Loader2 className="h-6 w-6 animate-spin mr-2" />
						<span className="text-muted-foreground">Učitavam predaje...</span>
					</div>
				) : !submissions || submissions.length === 0 ? (
					<div className="text-center py-8">
						<BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
						<h3 className="text-lg font-medium mb-2">Nema predaja</h3>
						<p className="text-muted-foreground mb-4">
							Još uvijek niste predali nijedan test. Počnite sa rješavanjem!
						</p>
						<Link href="/dashboard/testovi">
							<Button>
								<BookOpen className="h-4 w-4 mr-2" />
								Pogledaj dostupne testove
							</Button>
						</Link>
					</div>
				) : (
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{submissions.map((submission) => (
							<SubmissionCard key={submission.id} submission={submission} />
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
