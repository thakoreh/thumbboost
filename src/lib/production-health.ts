const requiredEnv = [
  "NEXT_PUBLIC_APP_URL",
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
  "CLERK_SECRET_KEY",
  "CONVEX_URL",
  "NEXT_PUBLIC_CONVEX_URL",
  "OPENAI_API_KEY",
  "STRIPE_SECRET_KEY",
  "STRIPE_BASIC_PRICE_ID",
  "STRIPE_PRO_PRICE_ID",
  "STRIPE_WEBHOOK_SECRET",
] as const;

const optionalEnv = ["YOUTUBE_API_KEY"] as const;

type Env = Record<string, string | undefined>;
type Health = ReturnType<typeof evaluateProductionHealth>;
type HealthMode = "liveness" | "readiness";
type HealthOptions = {
  strictProduction?: boolean;
  allowTestProviderKeys?: boolean;
};

function missing(keys: readonly string[], env: Env) {
  return keys.filter((key) => !env[key as keyof Env]?.trim());
}

function isValidUrl(value: string | undefined, options?: { requireHttps?: boolean; rejectLocalhost?: boolean }) {
  if (!value) return false;
  try {
    const url = new URL(value);
    if (options?.requireHttps && url.protocol !== "https:") return false;
    if (options?.rejectLocalhost && ["localhost", "127.0.0.1", "::1"].includes(url.hostname)) return false;
    return true;
  } catch {
    return false;
  }
}

function strictInvalidRequired(env: Env, options: HealthOptions = {}) {
  const invalid: string[] = [];
  const appUrl = env.NEXT_PUBLIC_APP_URL?.trim();
  const clerkIssuer = env.CLERK_JWT_ISSUER_DOMAIN?.trim();
  const convexUrl = env.CONVEX_URL?.trim() || env.NEXT_PUBLIC_CONVEX_URL?.trim();

  if (appUrl && !isValidUrl(appUrl, { requireHttps: true, rejectLocalhost: true })) {
    invalid.push("NEXT_PUBLIC_APP_URL must be an https production URL");
  }
  if (clerkIssuer && !isValidUrl(clerkIssuer)) {
    invalid.push("CLERK_JWT_ISSUER_DOMAIN must be a valid URL");
  }
  if (convexUrl && !isValidUrl(convexUrl)) {
    invalid.push(`${env.CONVEX_URL?.trim() ? "CONVEX_URL" : "NEXT_PUBLIC_CONVEX_URL"} must be a valid URL`);
  }
  if (!options.allowTestProviderKeys) {
    if (env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.startsWith("pk_test_")) {
      invalid.push("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY must use a live Clerk publishable key");
    }
    if (env.CLERK_SECRET_KEY?.startsWith("sk_test_")) {
      invalid.push("CLERK_SECRET_KEY must use a live Clerk secret key");
    }
    if (env.STRIPE_SECRET_KEY?.startsWith("sk_test_")) {
      invalid.push("STRIPE_SECRET_KEY must use a live Stripe secret key");
    }
  }
  if (env.OPENAI_API_KEY?.trim() === "sk-test") {
    invalid.push("OPENAI_API_KEY must not be the placeholder sk-test value");
  }

  return invalid;
}

export function evaluateProductionHealth(env: Env = process.env, options: HealthOptions = {}) {
  const missingRequired = missing(requiredEnv, env);
  const hasConvexUrl = Boolean(env.CONVEX_URL?.trim() || env.NEXT_PUBLIC_CONVEX_URL?.trim());
  const normalizedMissingRequired = missingRequired.filter((key) => key !== "CONVEX_URL" && key !== "NEXT_PUBLIC_CONVEX_URL");
  if (!hasConvexUrl) normalizedMissingRequired.push("CONVEX_URL or NEXT_PUBLIC_CONVEX_URL");
  const missingOptional = missing(optionalEnv, env);
  const invalidRequired = options.strictProduction ? strictInvalidRequired(env, options) : [];

  return {
    ok: normalizedMissingRequired.length === 0 && invalidRequired.length === 0,
    service: "thumbboost",
    status: normalizedMissingRequired.length === 0 && invalidRequired.length === 0 ? 200 : 503,
    missingRequired: normalizedMissingRequired,
    invalidRequired,
    missingOptional,
  };
}

export function healthHttpStatus(health: Health, mode: HealthMode = "readiness") {
  return mode === "liveness" ? 200 : health.status;
}
