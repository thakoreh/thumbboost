import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { hasClerkSecret } from "@/lib/auth-config";
import { authRoutes } from "@/lib/auth-routes";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

const clerkProxy = clerkMiddleware(
  async (auth, request) => {
    if (isProtectedRoute(request)) await auth.protect();
  },
  {
    signInUrl: authRoutes.signInUrl,
    signUpUrl: authRoutes.signUpUrl,
  },
);

export default function proxy(request: NextRequest, event: NextFetchEvent) {
  if (!hasClerkSecret()) return NextResponse.next();
  return clerkProxy(request, event);
}

export const config = {
  matcher: [
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
