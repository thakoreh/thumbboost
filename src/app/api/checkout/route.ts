import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const plan = String(body.plan || "basic");
  return NextResponse.redirect(new URL(`/api/stripe/checkout?plan=${encodeURIComponent(plan)}`, request.url), 307);
}

export async function GET(request: NextRequest) {
  const plan = request.nextUrl.searchParams.get("plan") || "basic";
  return NextResponse.redirect(new URL(`/api/stripe/checkout?plan=${encodeURIComponent(plan)}`, request.url), 307);
}
