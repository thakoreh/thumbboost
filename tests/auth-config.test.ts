import test from "node:test";
import assert from "node:assert/strict";
import { hasClerkSecret, isClerkConfigured } from "../src/lib/auth-config.ts";

test("Clerk is configured only when publishable and secret keys are both present", () => {
  assert.equal(isClerkConfigured({ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_test", CLERK_SECRET_KEY: "sk_test" }), true);
  assert.equal(isClerkConfigured({ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_test", CLERK_SECRET_KEY: "" }), false);
  assert.equal(isClerkConfigured({ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "", CLERK_SECRET_KEY: "sk_test" }), false);
});

test("server Clerk calls only require the runtime secret key", () => {
  assert.equal(hasClerkSecret({ CLERK_SECRET_KEY: "sk_test" }), true);
  assert.equal(hasClerkSecret({ CLERK_SECRET_KEY: "" }), false);
});
