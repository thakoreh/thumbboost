import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({ ok: true, service: "thumbboost", ts: new Date().toISOString() });
}
