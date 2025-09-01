import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
	"/",
	"/pricing",
	"/sign-in(.*)",
	"/sign-up(.*)",
	"/unauthorized",
]);

const isAdminRoute = createRouteMatcher([
	"/dashboard/korisnici(.*)",
	"/api/admin(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
	// Protect all non-public routes
	if (!isPublicRoute(req)) {
		await auth.protect();
	}

	// Check admin access for admin routes
	if (isAdminRoute(req)) {
		const { userId } = await auth.protect();

		if (!userId) {
			return Response.redirect(new URL("/sign-in", req.url));
		}

		// Get user from Clerk to check publicMetadata
		const { clerkClient } = await import("@clerk/nextjs/server");
		const clerk = await clerkClient();
		const user = await clerk.users.getUser(userId);

		// Check if user has admin role in publicMetadata
		const isAdmin = (user.publicMetadata as any)?.role === "admin";

		if (!isAdmin) {
			// Redirect to unauthorized page
			return Response.redirect(new URL("/unauthorized", req.url));
		}
	}
});

export const config = {
	matcher: [
		// Skip Next.js internals and all static files, unless found in search params
		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|mp4|mp3|mov|avi|mkv)).*)",
		// Always run for API routes
		"/(api|trpc)(.*)",
	],
};
