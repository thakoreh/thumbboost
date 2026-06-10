import { NextResponse } from "next/server";
import { evaluateProductionHealth, healthHttpStatus } from "@/lib/production-health";

export function GET() {
  const health = evaluateProductionHealth();
  return NextResponse.json({ ...health, mode: "liveness", ts: new Date().toISOString() }, { status: healthHttpStatus(health, "liveness") });
}
