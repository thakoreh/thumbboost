import { NextResponse } from "next/server";
import { evaluateProductionHealth } from "@/lib/production-health";

export function GET() {
  const health = evaluateProductionHealth();
  return NextResponse.json({ ...health, ts: new Date().toISOString() }, { status: health.status });
}
