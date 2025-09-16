"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "app/_components/ui/card";
import { Button } from "app/_components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "app/_components/ui/select";
import { Crown, Sparkles, Zap } from "lucide-react";
import { updateUserPlanPreference } from "./actions";
import Navbar from "app/_components/custom/navbar";

export default function PrijavaPage() {
	const { user } = useUser();
	const router = useRouter();
	const [selectedPlan, setSelectedPlan] = useState<string>("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!selectedPlan || !user) {
			return;
		}

		try {
			setIsSubmitting(true);

			// Update user's public metadata using server action
			await updateUserPlanPreference(selectedPlan);

			// Redirect back to dashboard
			router.push("/dashboard");
		} catch (error) {
			console.error("Failed to update user plan preference:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const getPlanIcon = (plan: string) => {
		switch (plan) {
			case "free":
				return <Sparkles className="h-4 w-4" />;
			case "pro":
				return <Zap className="h-4 w-4" />;
			case "pro+":
				return <Crown className="h-4 w-4" />;
			default:
				return null;
		}
	};

	const getPlanDescription = (plan: string) => {
		switch (plan) {
			case "free":
				return "Osnovne funkcionalnosti za c10 (default)";
			case "pro":
				return "Napredne funkcionalnosti i pristup testovima";
			case "pro+":
				return "Sve funkcionalnosti i dodatni benefiti";
			default:
				return "";
		}
	};

	if (!user) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
			</div>
		);
	}

	return (
		<>
			<Navbar />
			<div className="min-h-screen flex items-center justify-center p-4">
				<Card className="w-full max-w-md">
					<CardHeader className="text-center">
						<CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
							<Crown className="h-6 w-6 text-yellow-500" />
							Odaberite plan
						</CardTitle>
						<CardDescription>
							Izaberite plan koji najbolje odgovara vašim potrebama
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-6">
							<div className="space-y-2">
								<label htmlFor="plan" className="text-sm font-medium">
									Plan
								</label>
								<Select value={selectedPlan} onValueChange={setSelectedPlan}>
									<SelectTrigger className="w-full whitespace-nowrap">
										<SelectValue placeholder="Odaberite plan..." />
									</SelectTrigger>
									<SelectContent className="w-full">
										<SelectItem value="free" className="whitespace-nowrap">
											<div className="flex items-center gap-2">
												{getPlanIcon("free")}
												<div className="flex items-center gap-2">
													<div className="font-medium">Free</div>
													<div className="text-xs text-muted-foreground whitespace-nowrap">
														{getPlanDescription("free")}
													</div>
												</div>
											</div>
										</SelectItem>
										<SelectItem value="pro" className="whitespace-nowrap">
											<div className="flex items-center gap-2">
												{getPlanIcon("pro")}
												<div className="flex items-center gap-2">
													<div className="font-medium">Pro</div>
													<div className="text-xs text-muted-foreground whitespace-nowrap">
														{getPlanDescription("pro")}
													</div>
												</div>
											</div>
										</SelectItem>
										<SelectItem value="pro+" className="whitespace-nowrap">
											<div className="flex items-center gap-2">
												{getPlanIcon("pro+")}
												<div className="flex items-center gap-2">
													<div className="font-medium">Pro+</div>
													<div className="text-xs text-muted-foreground whitespace-nowrap">
														{getPlanDescription("pro+")}
													</div>
												</div>
											</div>
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<p className="text-sm text-muted-foreground">
								Free plan se automatski podrazumijeva svima, nije nužno da ga
								birate. Ako želite Pro ili Pro+ planove, izaberite ih, pa ćete
								biti obaviješteni putem maila za dalje korake.
							</p>

							<Button
								type="submit"
								disabled={!selectedPlan || isSubmitting}
								className="w-full bg-primary-gradient"
							>
								{isSubmitting ? "Ažuriramo..." : "Potvrdi izbor"}
							</Button>
						</form>
					</CardContent>
				</Card>
			</div>
		</>
	);
}
