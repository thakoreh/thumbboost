export const authRoutes = {
  signInUrl: "/sign-in",
  signUpUrl: "/sign-up",
  afterSignOutUrl: "/",
  fallbackRedirectUrl: "/studio",
} as const;

export const clerkAuthProps = authRoutes;
