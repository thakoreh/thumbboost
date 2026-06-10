import test from "node:test";
import assert from "node:assert/strict";
import { canonicalAppOrigin, publicOrigin } from "../src/lib/origin.ts";

function request(headers: Record<string, string>, host = "internal:3000") {
  return {
    headers: {
      get(name: string) {
        return headers[name.toLowerCase()] ?? null;
      },
    },
    nextUrl: { host },
  };
}

test("canonicalAppOrigin only accepts HTTPS non-local configured app URLs", () => {
  assert.equal(canonicalAppOrigin("https://thumbai.app/"), "https://thumbai.app");
  assert.equal(canonicalAppOrigin("http://thumbai.app"), undefined);
  assert.equal(canonicalAppOrigin("https://localhost:3000"), undefined);
  assert.equal(canonicalAppOrigin("not a url"), undefined);
});

test("publicOrigin prefers configured production app URL over forwarded headers", () => {
  assert.equal(
    publicOrigin(request({ "x-forwarded-host": "preview.example", "x-forwarded-proto": "https" }), {
      NEXT_PUBLIC_APP_URL: "https://thumbai.app/",
    }),
    "https://thumbai.app",
  );
});

test("publicOrigin falls back to forwarded host and protocol when no canonical app URL is configured", () => {
  assert.equal(
    publicOrigin(request({ "x-forwarded-host": "thumbai.app", "x-forwarded-proto": "https" }), {}),
    "https://thumbai.app",
  );
});

test("publicOrigin keeps local development on HTTP", () => {
  assert.equal(publicOrigin(request({}, "localhost:3000"), {}), "http://localhost:3000");
});
