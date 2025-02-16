import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)", // Protect dashboard and subpages
  "/api/tests(.*)", // Protect API routes
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();

  if (!userId && isProtectedRoute(req)) {
    console.log("Unauthorized access, redirecting...");
    return redirectToSignIn();
  }
});

export const config = {
  matcher: [
    "/((?!_next|_static|_vercel|favicon.ico|.*\\.(png|jpg|jpeg|svg|css|js|json)).*)",
    "/(api|trpc)(.*)",
  ],
};
