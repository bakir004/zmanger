import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

export async function GET() {
	try {
		// Check if user is authenticated (middleware already verified admin role)
		const { userId } = await auth();
		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Fetch all users from Clerk
		const clerk = await clerkClient();
		const users = await clerk.users.getUserList({
			limit: 100, // Adjust as needed
			orderBy: "-created_at",
		});

		// Transform the data to match our interface
		const transformedUsers = users.data.map((user: any) => ({
			id: user.id,
			firstName: user.firstName,
			lastName: user.lastName,
			emailAddresses: user.emailAddresses.map((email: any) => ({
				emailAddress: email.emailAddress,
				verification: {
					status: email.verification?.status || "unverified",
				},
			})),
			imageUrl: user.imageUrl,
			createdAt: user.createdAt,
			lastSignInAt: user.lastSignInAt,
			publicMetadata: user.publicMetadata,
			unsafeMetadata: user.unsafeMetadata,
		}));

		return NextResponse.json({
			users: transformedUsers,
			total: users.totalCount,
		});
	} catch (error) {
		console.error("Error fetching users:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
