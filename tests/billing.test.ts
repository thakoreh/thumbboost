import test from "node:test";
import assert from "node:assert/strict";
import {
  billingPortalReturnUrl,
  canOpenBillingPortal,
  normalizeBillingIdentity,
  planFromBillingSignal,
  planFromCheckoutMetadata,
} from "../src/lib/billing.ts";

test("billing identity normalizes email and preserves Clerk linkage", () => {
  const identity = normalizeBillingIdentity({
    email: "Creator@Example.COM ",
    clerkUserId: "user_123",
    stripeCustomerId: "cus_123",
  });

  assert.equal(identity.email, "creator@example.com");
  assert.equal(identity.clerkUserId, "user_123");
  assert.equal(identity.stripeCustomerId, "cus_123");
});

test("billing identity creates deterministic fallback email when webhook arrives first", () => {
  const identity = normalizeBillingIdentity({
    clerkUserId: "user_123",
    stripeCustomerId: "cus_123",
  });

  assert.equal(identity.email, "user_123@clerk.billing.thumbboost.local");
});

test("billing identity can fall back to Stripe customer when Clerk id is missing", () => {
  const identity = normalizeBillingIdentity({
    stripeCustomerId: "cus_123",
  });

  assert.equal(identity.email, "cus_123@stripe.billing.thumbboost.local");
});

test("active and trialing subscriptions grant the resolved paid plan", () => {
  assert.equal(planFromBillingSignal({ status: "active", candidatePlan: "pro" }), "pro");
  assert.equal(planFromBillingSignal({ status: "trialing", candidatePlan: "basic" }), "basic");
});

test("inactive subscriptions downgrade to free", () => {
  assert.equal(planFromBillingSignal({ status: "past_due", candidatePlan: "pro" }), "free");
  assert.equal(planFromBillingSignal({ status: "canceled", candidatePlan: "basic" }), "free");
  assert.equal(planFromBillingSignal({ status: "unpaid", candidatePlan: "pro" }), "free");
});

test("billing plan metadata is validated before granting access", () => {
  assert.equal(planFromBillingSignal({ status: "active", candidatePlan: "enterprise" }), "free");
  assert.equal(planFromBillingSignal({ status: "active", candidatePlan: undefined }), "free");
});

test("checkout webhooks only grant paid plans for ThumbBoost checkout metadata", () => {
  assert.equal(planFromCheckoutMetadata({ product: "thumbboost", appPlan: "basic" }), "basic");
  assert.equal(planFromCheckoutMetadata({ product: "thumbboost", appPlan: "pro" }), "pro");
  assert.equal(planFromCheckoutMetadata({ product: "other", appPlan: "basic" }), null);
  assert.equal(planFromCheckoutMetadata({ product: "thumbboost", appPlan: "free" }), null);
  assert.equal(planFromCheckoutMetadata({ product: "thumbboost" }), null);
});

test("billing portal return URL points back to the studio without double slashes", () => {
  assert.equal(billingPortalReturnUrl("https://thumbboost.app/"), "https://thumbboost.app/studio?billing=portal_return");
});

test("billing portal only opens for paid accounts with a Stripe customer", () => {
  assert.equal(canOpenBillingPortal({ plan: "basic", stripeCustomerId: "cus_123" }), true);
  assert.equal(canOpenBillingPortal({ plan: "pro", stripeCustomerId: " cus_123 " }), true);
  assert.equal(canOpenBillingPortal({ plan: "free", stripeCustomerId: "cus_123" }), false);
  assert.equal(canOpenBillingPortal({ plan: "basic", stripeCustomerId: "" }), false);
  assert.equal(canOpenBillingPortal({ plan: null, stripeCustomerId: "cus_123" }), false);
});
