import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

const planToEnv: Record<string, string> = {
  basic_monthly: "STRIPE_PRICE_BASIC_MONTHLY",
  pro_monthly: "STRIPE_PRICE_PRO_MONTHLY",
};

export async function POST(request: NextRequest) {
  const { plan = "basic_monthly" } = await request.json().catch(() => ({}));
  const envName = planToEnv[String(plan)];
  const price = envName ? process.env[envName] : undefined;

  if (!process.env.STRIPE_SECRET_KEY || !price) {
    return NextResponse.json({ ok: false, error: "stripe_not_configured", requiredEnv: ["STRIPE_SECRET_KEY", envName].filter(Boolean) });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2026-05-27.dahlia" });
  const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price, quantity: 1 }],
    success_url: `${origin}/?checkout=success`,
    cancel_url: `${origin}/?checkout=cancelled`,
  });

  return NextResponse.json({ ok: true, url: session.url });
}
