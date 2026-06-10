import test from "node:test";
import assert from "node:assert/strict";
import { resolveRateLimit } from "../src/lib/rate-limit.ts";

test("rate limit creates a fresh bucket when none exists", () => {
  const result = resolveRateLimit({
    bucket: null,
    max: 3,
    windowMs: 60_000,
    now: 1_000,
  });

  assert.equal(result.ok, true);
  assert.equal(result.count, 1);
  assert.equal(result.remaining, 2);
  assert.equal(result.resetAt, 61_000);
});

test("rate limit increments an existing bucket until max", () => {
  const result = resolveRateLimit({
    bucket: { count: 2, resetAt: 61_000 },
    max: 3,
    windowMs: 60_000,
    now: 2_000,
  });

  assert.equal(result.ok, true);
  assert.equal(result.count, 3);
  assert.equal(result.remaining, 0);
  assert.equal(result.resetAt, 61_000);
});

test("rate limit rejects once the bucket is full", () => {
  const result = resolveRateLimit({
    bucket: { count: 3, resetAt: 61_000 },
    max: 3,
    windowMs: 60_000,
    now: 2_000,
  });

  assert.equal(result.ok, false);
  assert.equal(result.count, 3);
  assert.equal(result.remaining, 0);
  assert.equal(result.resetAt, 61_000);
});

test("rate limit resets expired buckets", () => {
  const result = resolveRateLimit({
    bucket: { count: 3, resetAt: 61_000 },
    max: 3,
    windowMs: 60_000,
    now: 61_001,
  });

  assert.equal(result.ok, true);
  assert.equal(result.count, 1);
  assert.equal(result.remaining, 2);
  assert.equal(result.resetAt, 121_001);
});
