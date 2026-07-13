import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Yahan define karein ki kaunse pages public rahenge (jo bina login ke dikhenge)
const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)']);

export default clerkMiddleware((auth, request) => {
  if (!isPublicRoute(request)) {
    auth().protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!.*\\..*|_next).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};