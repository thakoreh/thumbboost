import test from "node:test";
import assert from "node:assert/strict";
import { checkoutPlanId, plans, shouldWatermarkExport } from "../src/lib/plans.ts";

test("anonymous and free users receive watermarked exports", () => {
  assert.equal(shouldWatermarkExport(null), true);
  assert.equal(shouldWatermarkExport("free"), true);
});

test("paid users receive clean exports", () => {
  assert.equal(shouldWatermarkExport("basic"), false);
  assert.equal(shouldWatermarkExport("pro"), false);
});

test("paid plan copy only promises currently implemented billing and export behavior", () => {
  const paidCopy = plans
    .filter((plan) => plan.price > 0)
    .flatMap((plan) => [plan.headline, plan.limitLabel, ...plan.features])
    .join(" ");

  assert.doesNotMatch(paidCopy, /unlimited/i);
  assert.doesNotMatch(paidCopy, /shareable/i);
  assert.doesNotMatch(paidCopy, /reusable style/i);
});

test("checkout plan parsing only allows paid plan ids", () => {
  assert.equal(checkoutPlanId("basic"), "basic");
  assert.equal(checkoutPlanId("pro"), "pro");
  assert.equal(checkoutPlanId("free"), null);
  assert.equal(checkoutPlanId("javascript:alert(1)"), null);
  assert.equal(checkoutPlanId(undefined), null);
});
