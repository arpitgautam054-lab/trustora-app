import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Home page ('/') ko protect karne ke liye route matcher
const isProtectedRoute = createRouteMatcher(['/']);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    auth().protect(); // Agar login nahi hai, toh login page par bhej do
  }
});

export const config = {
  matcher: [
    '/((?!.*\\..*|_next).*)',
    '/',
    '/(api|trpc)(.*)',
  ],
};