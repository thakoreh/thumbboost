import Stripe from "stripe";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { hasClerkSecret } from "@/lib/auth-config";
import { runtimeEnv } from "@/lib/env";
import { publicOrigin } from "@/lib/origin";
import { checkoutPlanId, getPlan } from "@/lib/plans";

export async function GET(request: NextRequest) {
  const planId = checkoutPlanId(request.nextUrl.searchParams.get("plan"));
  if (!planId) {
    return NextResponse.json({ ok: false, error: "invalid_plan" }, { status: 400 });
  }
  const plan = getPlan(planId);

  const price = plan.priceEnv ? runtimeEnv(plan.priceEnv) : undefined;
  const stripeSecretKey = runtimeEnv("STRIPE_SECRET_KEY");
  if (!stripeSecretKey || !price) {
    return NextResponse.json({ ok: false, error: "stripe_not_configured" }, { status: 503 });
  }
  if (!hasClerkSecret()) {
    return NextResponse.json({ ok: false, error: "auth_not_configured" }, { status: 503 });
  }

  const { userId } = await auth();
  const origin = publicOrigin(request);
  if (!userId) {
    const redirectUrl = new URL("/sign-in", origin);
    redirectUrl.searchParams.set("redirect_url", `/api/stripe/checkout?plan=${plan.id}`);
    return NextResponse.redirect(redirectUrl, 307);
  }
  const user = await currentUser().catch(() => null);
  const email = user?.emailAddresses?.[0]?.emailAddress;
  const stripe = new Stripe(stripeSecretKey, { apiVersion: "2026-05-27.dahlia" });
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
