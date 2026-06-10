import test from "node:test";
import assert from "node:assert/strict";
import { authRoutes, clerkAuthProps } from "../src/lib/auth-routes.ts";

test("auth routes keep Clerk navigation inside the app", () => {
  assert.deepEqual(authRoutes, {
    signInUrl: "/sign-in",
    signUpUrl: "/sign-up",
    afterSignOutUrl: "/",
    fallbackRedirectUrl: "/studio",
  });
});

test("Clerk auth props share local routes across provider and embedded forms", () => {
  assert.deepEqual(clerkAuthProps, {
    signInUrl: "/sign-in",
    signUpUrl: "/sign-up",
    afterSignOutUrl: "/",
    fallbackRedirectUrl: "/studio",
  });
});
