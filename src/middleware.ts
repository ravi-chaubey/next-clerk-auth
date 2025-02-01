import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define explicitly allowed public routes
const publicRoutes = [
  "/", // Home page
  "/auth(.*)",
  "/api/check-user",
];

const isPublicRoute = createRouteMatcher(publicRoutes);

export default clerkMiddleware(async (authPromise, req) => {
  const auth = await authPromise; // Await the auth object

  if (!isPublicRoute(req)) {
    await auth.protect(); // Now `auth` has `protect()`
  }
});

export const config = {
  matcher: [
    // Protect everything except explicitly listed public routes
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:css|js|json|jpg|jpeg|png|gif|svg|ttf|woff2?|csv|docx?|xlsx?|zip|webmanifest)$).*)",
  ],
};
