"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";

export async function updateUserPlanPreference(plan: string) {
	try {
		const { userId } = await auth();

		if (!userId) {
			throw new Error("User not authenticated");
		}

		// Update user's public metadata using Clerk's server API
		const client = await clerkClient();
		await client.users.updateUserMetadata(userId, {
			publicMetadata: {
				wants: plan,
			},
		});

		return { success: true };
	} catch (error) {
		console.error("Failed to update user plan preference:", error);
		throw error;
	}
}
