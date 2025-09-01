"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../../_components/ui/card";
import { Button } from "../../_components/ui/button";
import { Shield, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { lexend } from "../../_fonts/fonts";

export default function UnauthorizedPage() {
	const router = useRouter();

	return (
		<div className="min-h-screen bg-[#090b0c] flex items-center justify-center px-4">
			<Card className="w-full max-w-md bg-gray-900 border-gray-700">
				<CardHeader className="text-center">
					<Shield className="h-16 w-16 mx-auto mb-4 text-red-500" />
					<CardTitle className={`text-2xl text-red-500 ${lexend.className}`}>
						Pristup odbijen
					</CardTitle>
					<CardDescription className="text-gray-300">
						Nemate dozvolu za pristup ovoj stranici. Samo administratori mogu
						pristupiti admin panelu.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="text-center">
						<p className="text-sm text-gray-400 mb-4">
							Ako mislite da je ovo greška, kontaktirajte administratora.
						</p>
						<Button
							onClick={() => router.push("/dashboard")}
							className="w-full"
						>
							<ArrowLeft className="h-4 w-4 mr-2" />
							Povratak na Dashboard
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
