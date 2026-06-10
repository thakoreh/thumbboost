import test from "node:test";
import assert from "node:assert/strict";
import {
  FREE_THUMBNAILS_PER_MONTH,
  MAX_VARIATIONS_PER_REQUEST,
  resolveUsageAfterRefund,
  resolveGenerationQuota,
} from "../src/lib/usage.ts";

test("free plan is capped by remaining monthly thumbnail quota", () => {
  const quota = resolveGenerationQuota({
    plan: "free",
    requestedVariations: 6,
    thumbnailsThisMonth: 3,
    lastUsageReset: Date.UTC(2026, 5, 1),
    now: Date.UTC(2026, 5, 10),
  });

  assert.equal(quota.allowedVariations, 2);
  assert.equal(quota.remainingAfterReservation, 0);
  assert.equal(quota.nextUsageCount, FREE_THUMBNAILS_PER_MONTH);
  assert.equal(quota.quotaExceeded, false);
});

test("free plan reports quota exceeded when no monthly thumbnails remain", () => {
  const quota = resolveGenerationQuota({
    plan: "free",
    requestedVariations: 1,
    thumbnailsThisMonth: FREE_THUMBNAILS_PER_MONTH,
    lastUsageReset: Date.UTC(2026, 5, 1),
    now: Date.UTC(2026, 5, 10),
  });

  assert.equal(quota.allowedVariations, 0);
  assert.equal(quota.remainingBeforeReservation, 0);
  assert.equal(quota.quotaExceeded, true);
});

test("old monthly usage resets before quota is calculated", () => {
  const quota = resolveGenerationQuota({
    plan: "free",
    requestedVariations: 6,
    thumbnailsThisMonth: FREE_THUMBNAILS_PER_MONTH,
    lastUsageReset: Date.UTC(2026, 4, 31),
    now: Date.UTC(2026, 5, 1),
  });

  assert.equal(quota.allowedVariations, FREE_THUMBNAILS_PER_MONTH);
  assert.equal(quota.nextUsageCount, FREE_THUMBNAILS_PER_MONTH);
  assert.equal(quota.resetUsage, true);
});

test("paid plans bypass monthly quota but still cap one request", () => {
  const quota = resolveGenerationQuota({
    plan: "pro",
    requestedVariations: 99,
    thumbnailsThisMonth: 500,
    lastUsageReset: Date.UTC(2026, 5, 1),
    now: Date.UTC(2026, 5, 10),
  });

  assert.equal(quota.allowedVariations, MAX_VARIATIONS_PER_REQUEST);
  assert.equal(quota.quotaExceeded, false);
  assert.equal(quota.nextUsageCount, 506);
});

test("quota refunds never reduce monthly usage below zero", () => {
  assert.equal(resolveUsageAfterRefund({ thumbnailsThisMonth: 5, refundAmount: 2 }), 3);
  assert.equal(resolveUsageAfterRefund({ thumbnailsThisMonth: 1, refundAmount: 6 }), 0);
});
