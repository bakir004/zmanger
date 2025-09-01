export interface ClerkUser {
	id: string;
	firstName: string | null;
	lastName: string | null;
	emailAddresses: Array<{
		emailAddress: string;
		verification: {
			status: string;
		};
	}>;
	imageUrl: string;
	createdAt: number;
	lastSignInAt: number | null;
	publicMetadata: Record<string, any>;
	unsafeMetadata: Record<string, any>;
}

export interface IClerkService {
	getAllUsers(): Promise<ClerkUser[]>;
	updateUserPlan(clerkUserId: string, plan: string): Promise<void>;
	updateUserRole(clerkUserId: string, role: string): Promise<void>;
}
