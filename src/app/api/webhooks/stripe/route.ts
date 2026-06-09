import Stripe from "stripe";
import { ConvexHttpClient } from "convex/browser";
import { NextRequest, NextResponse } from "next/server";
import { api } from "../../../../../convex/_generated/api";
import { planForPriceId, type PlanId } from "@/lib/plans";

function convexClient() {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) return null;
  return new ConvexHttpClient(url);
}

function subscriptionPlan(subscription: Stripe.Subscription): PlanId | null {
  const priceId = subscription.items.data[0]?.price.id;
  return planForPriceId(priceId) ?? (subscription.metadata.appPlan as PlanId | undefined) ?? null;
}

export async function POST(request: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ ok: false, error: "stripe_webhook_not_configured" }, { status: 503 });
  }
  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ ok: false, error: "Missing Stripe signature" }, { status: 400 });

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2026-05-27.dahlia" });
  const rawBody = await request.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid Stripe signature" }, { status: 400 });
  }

  const convex = convexClient();
  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const plan = (session.metadata?.appPlan as PlanId | undefined) ?? "basic";
      await convex?.mutation(api.users.updateBilling, {
        email: session.customer_details?.email ?? session.customer_email ?? session.metadata?.email ?? undefined,
        clerkUserId: session.metadata?.clerkUserId || undefined,
        stripeCustomerId: typeof session.customer === "string" ? session.customer : undefined,
        stripeSubscriptionId: typeof session.subscription === "string" ? session.subscription : undefined,
        plan,
      });
    }

    if (event.type === "customer.subscription.created" || event.type === "customer.subscription.updated") {
      const subscription = event.data.object as Stripe.Subscription;
      const plan = subscriptionPlan(subscription) ?? "basic";
      await convex?.mutation(api.users.updateBilling, {
        email: subscription.metadata.email || undefined,
        clerkUserId: subscription.metadata.clerkUserId || undefined,
        stripeCustomerId: typeof subscription.customer === "string" ? subscription.customer : undefined,
        stripeSubscriptionId: subscription.id,
        plan,
      });
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;
      await convex?.mutation(api.users.updateBilling, {
        email: subscription.metadata.email || undefined,
        clerkUserId: subscription.metadata.clerkUserId || undefined,
        stripeCustomerId: typeof subscription.customer === "string" ? subscription.customer : undefined,
        stripeSubscriptionId: subscription.id,
        plan: "free",
      });
    }
  } catch (error) {
    console.error("stripe_webhook_sync_failed", error);
    return NextResponse.json({ ok: false, error: "billing_sync_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, received: true });
}
