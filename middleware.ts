import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
	"/",
	"/dashboard(.*)",
	"/sign-in(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
	if (!isPublicRoute(req)) {
		await auth.protect();
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

// export default clerkMiddleware(async (auth, req) => {
// 	if (!isPublicRoute(req)) {
// 	  const { userId, sessionClaims } = await auth.protect();

// 	  // Example: Check for a custom role claim
// 	  const userRole = sessionClaims?.role; // or sessionClaims?.publicMetadata?.role

// 	  if (userRole !== "admin") {
// 		// Optionally, you can redirect or throw an error
// 		return Response.redirect("/unauthorized");
// 	  }
// 	}
//   });
