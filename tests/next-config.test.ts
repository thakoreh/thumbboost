import test from "node:test";
import assert from "node:assert/strict";
import nextConfig from "../next.config.ts";

test("global security headers include transport and clickjacking protections", async () => {
  assert.equal(nextConfig.poweredByHeader, false);
  const headersFn = nextConfig.headers;
  assert.equal(typeof headersFn, "function");
  if (typeof headersFn !== "function") assert.fail("nextConfig.headers must be a function");
  const rules = await headersFn();
  const globalRule = rules.find((rule) => rule.source === "/(.*)");
  assert.ok(globalRule);
  const headers = new Map(globalRule.headers.map((header) => [header.key.toLowerCase(), header.value]));

  assert.equal(headers.get("x-frame-options"), "DENY");
  assert.equal(headers.get("x-content-type-options"), "nosniff");
  assert.equal(headers.get("strict-transport-security"), "max-age=63072000; includeSubDomains; preload");
});
