import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Yahan define karein ki kaunse pages public rahenge
// Abhi ke liye sirf sign-in aur sign-up ko public rakha hai
const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)']);

export default clerkMiddleware((auth, request) => {
  if (!isPublicRoute(request)) {
    auth().protect(); // Ye line user ko login page par dhakel degi agar wo login nahi hai
  }
});

export const config = {
  matcher: [
    '/((?!.*\\..*|_next).*)', 
    '/', 
    '/(api|trpc)(.*)',
  ],
};