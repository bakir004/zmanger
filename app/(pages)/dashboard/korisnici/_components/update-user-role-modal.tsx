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
import { Shield } from "lucide-react";
import { updateUserRole } from "../../actions";
import { useQueryClient } from "@tanstack/react-query";

interface UpdateUserRoleModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	user: {
		id: string;
		firstName: string | null;
		lastName: string | null;
		currentRole: string;
	};
}

const roleOptions = [
	{ value: "korisnik", label: "Korisnik" },
	{ value: "moderator", label: "Moderator" },
	{ value: "admin", label: "Administrator" },
];

export function UpdateUserRoleModal({
	open,
	onOpenChange,
	user,
}: UpdateUserRoleModalProps) {
	const [selectedRole, setSelectedRole] = useState(user.currentRole);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const queryClient = useQueryClient();

	// Update selectedRole when user changes
	useEffect(() => {
		setSelectedRole(user.currentRole);
	}, [user.currentRole]);

	const handleSubmit = async () => {
		if (selectedRole === user.currentRole) {
			onOpenChange(false);
			return;
		}

		setIsSubmitting(true);
		try {
			await updateUserRole(user.id, selectedRole);

			// Invalidate and refetch users data
			await queryClient.invalidateQueries({ queryKey: ["clerk-users"] });

			onOpenChange(false);
		} catch (error) {
			console.error("Error updating user role:", error);
			// You could add toast notification here
		} finally {
			setIsSubmitting(false);
		}
	};

	console.log("UpdateUserRoleModal", user);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Shield className="h-5 w-5" />
						Promijeni ulogu korisnika
					</DialogTitle>
					<DialogDescription>
						Promijeni ulogu za korisnika{" "}
						<span className="font-semibold">
							{user.firstName} {user.lastName}
						</span>
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						<label htmlFor="role" className="text-right">
							Uloga
						</label>
						<Select value={selectedRole} onValueChange={setSelectedRole}>
							<SelectTrigger className="col-span-3">
								<SelectValue placeholder="Odaberi ulogu" />
							</SelectTrigger>
							<SelectContent>
								{roleOptions.map((option) => (
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
