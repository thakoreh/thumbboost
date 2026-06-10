type ClerkEnv = Record<string, string | undefined>;

export function isClerkConfigured(env: ClerkEnv = process.env) {
  return Boolean(env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim() && env.CLERK_SECRET_KEY?.trim());
}

export function hasClerkSecret(env: ClerkEnv = process.env) {
  return Boolean(env.CLERK_SECRET_KEY?.trim());
}
