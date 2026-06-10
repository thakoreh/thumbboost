import test from "node:test";
import assert from "node:assert/strict";
import { runtimeEnv } from "../src/lib/env.ts";

test("runtimeEnv reads keys dynamically from the provided environment", () => {
  const env = { NEXT_PUBLIC_CONVEX_URL: "https://example.convex.cloud" };
  assert.equal(runtimeEnv("NEXT_PUBLIC_CONVEX_URL", env), "https://example.convex.cloud");
  assert.equal(runtimeEnv("MISSING", env), undefined);
});
