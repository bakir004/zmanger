import type {
	IClerkService,
	ClerkUser,
} from "~/application/services/clerk.service.interface";
import type { IInstrumentationService } from "~/application/services/instrumentation.service.interface";
import type { ICrashReporterService } from "~/application/services/crash-reporter.service.interface";

export class ClerkService implements IClerkService {
	constructor(
		private readonly instrumentationService: IInstrumentationService,
		private readonly crashReporterService: ICrashReporterService,
	) {}

	async getAllUsers(): Promise<ClerkUser[]> {
		return this.instrumentationService.startSpan(
			{ name: "ClerkService > getAllUsers" },
			async () => {
				try {
					console.log("ClerkService: Starting to fetch all users...");
					const secretKey = process.env.CLERK_SECRET_KEY;
					console.log("ClerkService: Secret key exists:", !!secretKey);

					const allUsers: any[] = [];
					let hasMore = true;
					let offset = 0;
					const limit = 100; // Fetch 100 users per request

					while (hasMore) {
						const url = `https://api.clerk.com/v1/users?limit=${limit}&offset=${offset}`;
						console.log(
							`ClerkService: Fetching users with offset ${offset}...`,
						);

						const response = await fetch(url, {
							method: "GET",
							headers: {
								Authorization: `Bearer ${secretKey}`,
								"Content-Type": "application/json",
							},
						});

						console.log("ClerkService: Response status:", response.status);
						if (!response.ok) {
							const errorText = await response.text();
							console.log("ClerkService: Error response:", errorText);
							throw new Error(
								`Failed to fetch users: ${response.statusText} - ${errorText}`,
							);
						}

						const data = await response.json();
						console.log(
							`ClerkService: Received ${data.length || 0} users in this batch`,
						);

						if (data && data.length > 0) {
							allUsers.push(...data);
							offset += limit;
							hasMore = data.has_more || false;
						} else {
							hasMore = false;
						}
					}

					console.log(`ClerkService: Total users fetched: ${allUsers.length}`);

					// Transform snake_case to camelCase to match our interface
					const transformedUsers: ClerkUser[] = allUsers.map((user: any) => ({
						id: user.id,
						firstName: user.first_name,
						lastName: user.last_name,
						emailAddresses:
							user.email_addresses?.map((email: any) => ({
								emailAddress: email.email_address,
								verification: {
									status: email.verification?.status || "unverified",
								},
							})) || [],
						imageUrl: user.image_url,
						createdAt: user.created_at,
						lastSignInAt: user.last_sign_in_at,
						publicMetadata: user.public_metadata || {},
						unsafeMetadata: user.unsafe_metadata || {},
					}));

					console.log(
						"ClerkService: Transformed users:",
						transformedUsers.length,
					);
					return transformedUsers;
				} catch (error) {
					console.log("ClerkService: Error occurred:", error);
					this.crashReporterService.report(error);
					throw error;
				}
			},
		);
	}

	async updateUserPlan(clerkUserId: string, plan: string): Promise<void> {
		return this.instrumentationService.startSpan(
			{ name: "ClerkService > updateUserPlan" },
			async () => {
				try {
					// First, get the current user data to preserve existing metadata
					const getResponse = await fetch(
						`https://api.clerk.com/v1/users/${clerkUserId}`,
						{
							method: "GET",
							headers: {
								Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
								"Content-Type": "application/json",
							},
						},
					);

					if (!getResponse.ok) {
						throw new Error(
							`Failed to fetch user data: ${getResponse.statusText}`,
						);
					}

					const userData = await getResponse.json();
					const currentMetadata = userData.public_metadata || {};

					// Merge the new plan with existing metadata
					const updatedMetadata = {
						...currentMetadata,
						plan,
					};

					// Update the user with merged metadata
					const response = await fetch(
						`https://api.clerk.com/v1/users/${clerkUserId}`,
						{
							method: "PATCH",
							headers: {
								Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
								"Content-Type": "application/json",
							},
							body: JSON.stringify({
								public_metadata: updatedMetadata,
							}),
						},
					);

					if (!response.ok) {
						throw new Error(
							`Failed to update user plan: ${response.statusText}`,
						);
					}
				} catch (error) {
					this.crashReporterService.report(error);
					throw error;
				}
			},
		);
	}

	async updateUserRole(clerkUserId: string, role: string): Promise<void> {
		return this.instrumentationService.startSpan(
			{ name: "ClerkService > updateUserRole" },
			async () => {
				try {
					// First, get the current user data to preserve existing metadata
					const getResponse = await fetch(
						`https://api.clerk.com/v1/users/${clerkUserId}`,
						{
							method: "GET",
							headers: {
								Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
								"Content-Type": "application/json",
							},
						},
					);

					if (!getResponse.ok) {
						throw new Error(
							`Failed to fetch user data: ${getResponse.statusText}`,
						);
					}

					const userData = await getResponse.json();
					const currentMetadata = userData.public_metadata || {};

					// Merge the new role with existing metadata
					const updatedMetadata = {
						...currentMetadata,
						role,
					};

					// Update the user with merged metadata
					const response = await fetch(
						`https://api.clerk.com/v1/users/${clerkUserId}`,
						{
							method: "PATCH",
							headers: {
								Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
								"Content-Type": "application/json",
							},
							body: JSON.stringify({
								public_metadata: updatedMetadata,
							}),
						},
					);

					if (!response.ok) {
						throw new Error(
							`Failed to update user role: ${response.statusText}`,
						);
					}
				} catch (error) {
					this.crashReporterService.report(error);
					throw error;
				}
			},
		);
	}
}
