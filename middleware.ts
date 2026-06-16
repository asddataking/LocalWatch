import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isAdminRoute(req)) await auth.protect();
});

export const config = {
  // Only run Clerk middleware on admin routes so the public site works
  // without Clerk env vars configured in Vercel.
  matcher: ['/admin(.*)'],
};
