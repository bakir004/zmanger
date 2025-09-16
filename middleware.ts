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

const isModeratorRoute = createRouteMatcher([
	"/dashboard/obavijesti(.*)",
	"/dashboard/testovi/dodaj(.*)",
	"/dashboard/testovi(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
	// Handle CORS preflight early
	if (req.method === "OPTIONS") {
		const origin = req.headers.get("origin") ?? "*";
		return new Response(null, {
			status: 204,
			headers: {
				"Access-Control-Allow-Origin": origin,
				Vary: "Origin",
				"Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,PATCH,OPTIONS",
				"Access-Control-Allow-Headers": "Content-Type, Authorization",
				"Access-Control-Allow-Credentials": "true",
			},
		});
	}
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

	if (isModeratorRoute(req)) {
		const { userId } = await auth.protect();

		if (!userId) {
			return Response.redirect(new URL("/sign-in", req.url));
		}
		const { clerkClient } = await import("@clerk/nextjs/server");
		const clerk = await clerkClient();
		const user = await clerk.users.getUser(userId);
		const isModerator = (user.publicMetadata as any)?.role === "moderator";
		const isAdmin = (user.publicMetadata as any)?.role === "admin";
		if (!isModerator && !isAdmin) {
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
