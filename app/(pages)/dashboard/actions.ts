"use server";

import { auth } from "@clerk/nextjs/server";
import { getInjection } from "di/container";

export async function getUserSubmissionsOverview() {
	const instrumentationService = getInjection("IInstrumentationService");

	return await instrumentationService.instrumentServerAction(
		"getUserSubmissionsOverview",
		{ recordResponse: true },
		async () => {
			try {
				const { userId } = await auth();
				if (!userId) {
					throw new Error("Unauthorized");
				}

				const getUserSubmissionsOverviewController = getInjection(
					"IGetUserSubmissionsOverviewController",
				);
				return await getUserSubmissionsOverviewController(userId);
			} catch (error) {
				console.error("Error fetching user submissions overview:", error);
				throw error;
			}
		},
	);
}

export async function getUserSubmissionByBatch(testBatchId: number) {
	const instrumentationService = getInjection("IInstrumentationService");

	return await instrumentationService.instrumentServerAction(
		"getUserSubmissionByBatch",
		{ recordResponse: true },
		async () => {
			try {
				const { userId } = await auth();
				if (!userId) {
					throw new Error("Unauthorized");
				}

				const getUserSubmissionByBatchController = getInjection(
					"IGetUserSubmissionByBatchController",
				);
				return await getUserSubmissionByBatchController(userId, {
					testBatchId,
				});
			} catch (error) {
				console.error("Error fetching user submission by batch:", error);
				throw error;
			}
		},
	);
}

export async function getUsersFromClerk() {
	const instrumentationService = getInjection("IInstrumentationService");

	return await instrumentationService.instrumentServerAction(
		"getUsersFromClerk",
		{ recordResponse: true },
		async () => {
			try {
				const { userId } = await auth();
				if (!userId) {
					throw new Error("Unauthorized");
				}

				const getUsersFromClerkController = getInjection(
					"IGetUsersFromClerkController",
				);
				return await getUsersFromClerkController();
			} catch (error) {
				console.error("Error fetching users from Clerk:", error);
				throw error;
			}
		},
	);
}

export async function updateUserPlan(targetUserId: string, plan: string) {
	const instrumentationService = getInjection("IInstrumentationService");

	return await instrumentationService.instrumentServerAction(
		"updateUserPlan",
		{ recordResponse: true },
		async () => {
			try {
				const { userId } = await auth();
				if (!userId) {
					throw new Error("Unauthorized");
				}

				const updateUserPlanController = getInjection(
					"IUpdateUserPlanController",
				);
				return await updateUserPlanController(targetUserId, plan);
			} catch (error) {
				console.error("Error updating user plan:", error);
				throw error;
			}
		},
	);
}

export async function updateUserRole(targetUserId: string, role: string) {
	const instrumentationService = getInjection("IInstrumentationService");

	return await instrumentationService.instrumentServerAction(
		"updateUserRole",
		{ recordResponse: true },
		async () => {
			try {
				const { userId } = await auth();
				if (!userId) {
					throw new Error("Unauthorized");
				}

				const updateUserRoleController = getInjection(
					"IUpdateUserRoleController",
				);
				return await updateUserRoleController(targetUserId, role);
			} catch (error) {
				console.error("Error updating user role:", error);
				throw error;
			}
		},
	);
}
