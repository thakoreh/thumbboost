import Stripe from "stripe";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { getPlan } from "@/lib/plans";

export async function GET(request: NextRequest) {
  const planId = request.nextUrl.searchParams.get("plan");
  const validIds = ["free", "basic", "pro"];
  if (!planId || !validIds.includes(planId)) {
    return NextResponse.json({ ok: false, error: "invalid_plan" }, { status: 400 });
  }
  const plan = getPlan(planId);

  if (plan.id === "free") {
    return NextResponse.redirect(new URL("/?onboarding=free", request.url));
  }

  const price = plan.priceEnv ? process.env[plan.priceEnv] : undefined;
  if (!process.env.STRIPE_SECRET_KEY || !price) {
    return NextResponse.json({ ok: false, error: "stripe_not_configured" }, { status: 503 });
  }

  const { userId } = await auth();
  if (!userId) {
    const redirectUrl = new URL("/sign-in", request.url);
    redirectUrl.searchParams.set("redirect_url", `/api/stripe/checkout?plan=${plan.id}`);
    return NextResponse.redirect(redirectUrl, 307);
  }
  const user = await currentUser().catch(() => null);
  const email = user?.emailAddresses?.[0]?.emailAddress;
  const origin = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2026-05-27.dahlia" });
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price, quantity: 1 }],
    success_url: `${origin}/?checkout=success&plan=${plan.id}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/?checkout=cancelled&plan=${plan.id}`,
    customer_email: email,
    client_reference_id: userId,
    metadata: { product: "thumbboost", appPlan: plan.id, clerkUserId: userId, email: email ?? "" },
    subscription_data: { metadata: { product: "thumbboost", appPlan: plan.id, clerkUserId: userId ?? "", email: email ?? "" } },
  });

  if (!session.url) return NextResponse.json({ ok: false, error: "checkout_url_missing" }, { status: 500 });
  return NextResponse.redirect(session.url, 307);
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const plan = String(body.plan || "basic");
  return GET(new NextRequest(new URL(`/api/stripe/checkout?plan=${plan}`, request.url), request));
}
