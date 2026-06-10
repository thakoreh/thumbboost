import { NextRequest, NextResponse } from "next/server";
import { publicOrigin } from "@/lib/origin";
import { checkoutPlanId } from "@/lib/plans";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const plan = checkoutPlanId(String(body.plan || ""));
  if (!plan) {
    return NextResponse.json({ ok: false, error: "invalid_plan" }, { status: 400 });
  }
  return NextResponse.redirect(new URL(`/api/stripe/checkout?plan=${encodeURIComponent(plan)}`, publicOrigin(request)), 307);
}

export async function GET(request: NextRequest) {
  const plan = checkoutPlanId(request.nextUrl.searchParams.get("plan"));
  if (!plan) {
    return NextResponse.json({ ok: false, error: "invalid_plan" }, { status: 400 });
  }
  return NextResponse.redirect(new URL(`/api/stripe/checkout?plan=${encodeURIComponent(plan)}`, publicOrigin(request)), 307);
}
