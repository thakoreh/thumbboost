import { NextResponse } from "next/server";
import { evaluateProductionHealth, healthHttpStatus } from "@/lib/production-health";

export function GET() {
  const health = evaluateProductionHealth(process.env, {
    strictProduction: true,
    allowTestProviderKeys: process.env.REQUIRE_LIVE_PROVIDER_KEYS !== "true",
  });
  return NextResponse.json({ ...health, mode: "readiness", ts: new Date().toISOString() }, { status: healthHttpStatus(health, "readiness") });
}
