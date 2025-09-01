"use client";

import { useState, useEffect } from "react";
import { Button } from "../../../../_components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "../../../../_components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../../../../_components/ui/select";
import { Crown } from "lucide-react";
import { updateUserPlan } from "../../actions";
import { useQueryClient } from "@tanstack/react-query";

interface UpdateUserPlanModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	user: {
		id: string;
		firstName: string | null;
		lastName: string | null;
		currentPlan: string;
	};
}

const planOptions = [
	{ value: "free", label: "Besplatan" },
	{ value: "pro", label: "Pro" },
	{ value: "pro+", label: "Pro+" },
];

export function UpdateUserPlanModal({
	open,
	onOpenChange,
	user,
}: UpdateUserPlanModalProps) {
	const [selectedPlan, setSelectedPlan] = useState(user.currentPlan);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const queryClient = useQueryClient();

	// Update selectedPlan when user changes
	useEffect(() => {
		setSelectedPlan(user.currentPlan);
	}, [user.currentPlan]);

	const handleSubmit = async () => {
		if (selectedPlan === user.currentPlan) {
			onOpenChange(false);
			return;
		}

		setIsSubmitting(true);
		try {
			await updateUserPlan(user.id, selectedPlan);

			// Invalidate and refetch users data
			await queryClient.invalidateQueries({ queryKey: ["clerk-users"] });

			onOpenChange(false);
		} catch (error) {
			console.error("Error updating user plan:", error);
			// You could add toast notification here
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Crown className="h-5 w-5" />
						Promijeni plan korisnika
					</DialogTitle>
					<DialogDescription>
						Promijeni plan za korisnika{" "}
						<span className="font-semibold">
							{user.firstName} {user.lastName}
						</span>
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						<label htmlFor="plan" className="text-right">
							Plan
						</label>
						<Select value={selectedPlan} onValueChange={setSelectedPlan}>
							<SelectTrigger className="col-span-3">
								<SelectValue placeholder="Odaberi plan" />
							</SelectTrigger>
							<SelectContent>
								{planOptions.map((option) => (
									<SelectItem key={option.value} value={option.value}>
										{option.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>
				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={isSubmitting}
					>
						Odustani
					</Button>
					<Button onClick={handleSubmit} disabled={isSubmitting}>
						{isSubmitting ? "Spremam..." : "Spremi"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
