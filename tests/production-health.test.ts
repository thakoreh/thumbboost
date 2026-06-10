import test from "node:test";
import assert from "node:assert/strict";
import { evaluateProductionHealth, healthHttpStatus } from "../src/lib/production-health.ts";

test("production health reports missing launch-critical environment variables", () => {
  const health = evaluateProductionHealth({
    NEXT_PUBLIC_APP_URL: "https://thumbboost.example",
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_live_123",
    CLERK_SECRET_KEY: "",
    CONVEX_URL: "",
    NEXT_PUBLIC_CONVEX_URL: "https://example.convex.cloud",
    OPENAI_API_KEY: "sk-test",
    STRIPE_SECRET_KEY: "sk_live_123",
    STRIPE_BASIC_PRICE_ID: "price_basic",
    STRIPE_PRO_PRICE_ID: "price_pro",
    STRIPE_WEBHOOK_SECRET: "",
  });

  assert.equal(health.ok, false);
  assert.deepEqual(health.missingRequired.sort(), ["CLERK_SECRET_KEY", "STRIPE_WEBHOOK_SECRET"]);
  assert.equal(health.status, 503);
});

test("production health allows optional YouTube key to be absent", () => {
  const health = evaluateProductionHealth({
    NEXT_PUBLIC_APP_URL: "https://thumbboost.example",
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_live_123",
    CLERK_SECRET_KEY: "sk_live_123",
    CLERK_JWT_ISSUER_DOMAIN: "https://clerk.example",
    CONVEX_URL: "https://example.convex.cloud",
    NEXT_PUBLIC_CONVEX_URL: "https://example.convex.cloud",
    OPENAI_API_KEY: "sk-test",
    STRIPE_SECRET_KEY: "sk_live_123",
    STRIPE_BASIC_PRICE_ID: "price_basic",
    STRIPE_PRO_PRICE_ID: "price_pro",
    STRIPE_WEBHOOK_SECRET: "whsec_123",
    YOUTUBE_API_KEY: "",
  });

  assert.equal(health.ok, true);
  assert.deepEqual(health.missingRequired, []);
  assert.deepEqual(health.missingOptional, ["YOUTUBE_API_KEY"]);
  assert.equal(health.status, 200);
});

test("production health accepts CONVEX_URL as the server-side Convex endpoint", () => {
  const health = evaluateProductionHealth({
    NEXT_PUBLIC_APP_URL: "https://thumbboost.example",
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_live_123",
    CLERK_SECRET_KEY: "sk_live_123",
    CLERK_JWT_ISSUER_DOMAIN: "https://clerk.example",
    CONVEX_URL: "https://example.convex.cloud",
    NEXT_PUBLIC_CONVEX_URL: "",
    OPENAI_API_KEY: "sk-test",
    STRIPE_SECRET_KEY: "sk_live_123",
    STRIPE_BASIC_PRICE_ID: "price_basic",
    STRIPE_PRO_PRICE_ID: "price_pro",
    STRIPE_WEBHOOK_SECRET: "whsec_123",
  });

  assert.equal(health.ok, true);
  assert.deepEqual(health.missingRequired, []);
});

test("strict production health rejects localhost and test-mode provider keys", () => {
  const health = evaluateProductionHealth(
    {
      NEXT_PUBLIC_APP_URL: "http://localhost:3000",
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_test_123",
      CLERK_SECRET_KEY: "sk_test_123",
      CLERK_JWT_ISSUER_DOMAIN: "https://clerk.example",
      CONVEX_URL: "https://example.convex.cloud",
      OPENAI_API_KEY: "sk-test",
      STRIPE_SECRET_KEY: "sk_test_123",
      STRIPE_BASIC_PRICE_ID: "price_basic",
      STRIPE_PRO_PRICE_ID: "price_pro",
      STRIPE_WEBHOOK_SECRET: "whsec_123",
    },
    { strictProduction: true },
  );

  assert.equal(health.ok, false);
  assert.deepEqual(health.invalidRequired.sort(), [
    "CLERK_SECRET_KEY must use a live Clerk secret key",
    "NEXT_PUBLIC_APP_URL must be an https production URL",
    "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY must use a live Clerk publishable key",
    "OPENAI_API_KEY must not be the placeholder sk-test value",
    "STRIPE_SECRET_KEY must use a live Stripe secret key",
  ]);
});

test("strict production health rejects malformed service URLs", () => {
  const health = evaluateProductionHealth(
    {
      NEXT_PUBLIC_APP_URL: "https://thumbboost.example",
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_live_123",
      CLERK_SECRET_KEY: "sk_live_123",
      CLERK_JWT_ISSUER_DOMAIN: "not a url",
      CONVEX_URL: "not a url either",
      OPENAI_API_KEY: "sk-real",
      STRIPE_SECRET_KEY: "sk_live_123",
      STRIPE_BASIC_PRICE_ID: "price_basic",
      STRIPE_PRO_PRICE_ID: "price_pro",
      STRIPE_WEBHOOK_SECRET: "whsec_123",
    },
    { strictProduction: true },
  );

  assert.equal(health.ok, false);
  assert.deepEqual(health.invalidRequired.sort(), ["CLERK_JWT_ISSUER_DOMAIN must be a valid URL", "CONVEX_URL must be a valid URL"]);
});

test("health status supports separate liveness and readiness checks", () => {
  const health = evaluateProductionHealth({}, { strictProduction: true });

  assert.equal(health.status, 503);
  assert.equal(healthHttpStatus(health, "liveness"), 200);
  assert.equal(healthHttpStatus(health, "readiness"), 503);
});
