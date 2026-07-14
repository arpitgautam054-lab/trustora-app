import { clerkMiddleware } from "@clerk/nextjs/server";

// Yeh function apne aap sabhi routes ko handle karta hai
export default clerkMiddleware();

export const config = {
  matcher: [
    // Static files aur images ko ignore karne ka pattern
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // API routes ko protect karne ka pattern
    '/(api|trpc)(.*)',
  ],
};