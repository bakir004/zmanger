"use server";

import { auth } from "@clerk/nextjs/server";
import { getInjection } from "di/container";
import { UnauthenticatedError } from "~/entities/errors/auth";
import type { ClerkUser } from "~/application/services/clerk.service.interface";

export async function getUsersFromClerk(): Promise<ClerkUser[]> {
	const instrumentationService = getInjection("IInstrumentationService");

	return await instrumentationService.instrumentServerAction(
		"getUsersFromClerk",
		{ recordResponse: true },
		async () => {
			try {
				console.log("Getting controller from DI container...");
				const getUsersFromClerkController = getInjection(
					"IGetUsersFromClerkController",
				);
				const result = await getUsersFromClerkController();
				return result;
			} catch (error) {
				console.error("Error fetching users from Clerk:", error);
				throw error;
			}
		},
	);
}

export async function updateUserRole(
	clerkUserId: string,
	role: string,
): Promise<void> {
	console.log("updateUserRole server action called", { clerkUserId, role });
	const instrumentationService = getInjection("IInstrumentationService");

	return await instrumentationService.instrumentServerAction(
		"updateUserRole",
		{ recordResponse: true },
		async () => {
			try {
				const updateUserRoleController = getInjection(
					"IUpdateUserRoleController",
				);
				await updateUserRoleController(clerkUserId, role);
				console.log("User role updated successfully");
			} catch (error) {
				console.error("Error updating user role:", error);
				throw error;
			}
		},
	);
}

export async function updateUserPlan(
	clerkUserId: string,
	plan: string,
): Promise<void> {
	console.log("updateUserPlan server action called", { clerkUserId, plan });
	const instrumentationService = getInjection("IInstrumentationService");

	return await instrumentationService.instrumentServerAction(
		"updateUserPlan",
		{ recordResponse: true },
		async () => {
			try {
				const updateUserPlanController = getInjection(
					"IUpdateUserPlanController",
				);
				await updateUserPlanController(clerkUserId, plan);
				console.log("User plan updated successfully");
			} catch (error) {
				console.error("Error updating user plan:", error);
				throw error;
			}
		},
	);
}

export async function addOffer() {
	const { userId } = await auth();
	const submission = {
		code: `
        #include <iostream>\n int main() { int a; std::cin >> a; std::cout << "niggas" << a; }
        `,
		language_id: 1,
		stdin: "1",
		expected_output: "",
	};

	const codeRunnerUrl = process.env.CODE_RUNNER_URL;
	if (!codeRunnerUrl) throw new Error("CODE_RUNNER_URL is not set");
	const res = await fetch(`${codeRunnerUrl}/submissions`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(submission),
	});
	const contentType = res.headers.get("content-type");
	let result: Response | string;
	if (contentType?.includes("application/json")) result = await res.json();
	else result = await res.text();

	console.log(result);
}
