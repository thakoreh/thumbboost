import Stripe from "stripe";
import { ConvexHttpClient } from "convex/browser";
import { NextRequest, NextResponse } from "next/server";
import { api } from "../../../../../convex/_generated/api";
import { isPlanId, planFromBillingSignal, planFromCheckoutMetadata } from "@/lib/billing";
import { runtimeEnv, serverConvexUrl } from "@/lib/env";
import { planForPriceId, type PlanId } from "@/lib/plans";

function convexClient() {
  const url = serverConvexUrl();
  if (!url) return null;
  return new ConvexHttpClient(url);
}

function subscriptionPlan(subscription: Stripe.Subscription): PlanId | null {
  const priceId = subscription.items.data[0]?.price.id;
  const metadataPlan = subscription.metadata.appPlan;
  return planForPriceId(priceId) ?? (isPlanId(metadataPlan) ? metadataPlan : null);
}

export async function POST(request: NextRequest) {
  const stripeSecretKey = runtimeEnv("STRIPE_SECRET_KEY");
  const stripeWebhookSecret = runtimeEnv("STRIPE_WEBHOOK_SECRET");
  if (!stripeSecretKey || !stripeWebhookSecret) {
    return NextResponse.json({ ok: false, error: "stripe_webhook_not_configured" }, { status: 503 });
  }
  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ ok: false, error: "Missing Stripe signature" }, { status: 400 });

  const stripe = new Stripe(stripeSecretKey, { apiVersion: "2026-05-27.dahlia" });
  const rawBody = await request.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, stripeWebhookSecret);
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid Stripe signature" }, { status: 400 });
  }

  const convex = convexClient();
  if (!convex) return NextResponse.json({ ok: false, error: "convex_not_configured" }, { status: 503 });
  try {
    const alreadyProcessed = await convex.query(api.users.hasProcessedStripeEvent, { eventId: event.id });
    if (alreadyProcessed) {
      return NextResponse.json({ ok: true, received: true, duplicate: true });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const plan = planFromCheckoutMetadata({
        product: session.metadata?.product,
        appPlan: session.metadata?.appPlan,
      });
      if (plan) {
        await convex?.mutation(api.users.updateBilling, {
          email: session.customer_details?.email ?? session.customer_email ?? session.metadata?.email ?? undefined,
          clerkUserId: session.metadata?.clerkUserId || undefined,
          stripeCustomerId: typeof session.customer === "string" ? session.customer : undefined,
          stripeSubscriptionId: typeof session.subscription === "string" ? session.subscription : undefined,
          stripeSubscriptionStatus: "checkout_completed",
          plan,
        });
      }
    }

    if (event.type === "customer.subscription.created" || event.type === "customer.subscription.updated") {
      const subscription = event.data.object as Stripe.Subscription;
      const priceId = subscription.items.data[0]?.price.id;
      const plan = planFromBillingSignal({ status: subscription.status, candidatePlan: subscriptionPlan(subscription) });
      await convex?.mutation(api.users.updateBilling, {
        email: subscription.metadata.email || undefined,
        clerkUserId: subscription.metadata.clerkUserId || undefined,
        stripeCustomerId: typeof subscription.customer === "string" ? subscription.customer : undefined,
        stripeSubscriptionId: subscription.id,
        stripeSubscriptionStatus: subscription.status,
        stripePriceId: priceId,
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
        stripeSubscriptionStatus: subscription.status || "deleted",
        stripePriceId: subscription.items.data[0]?.price.id,
        plan: "free",
      });
    }
    await convex.mutation(api.users.recordProcessedStripeEvent, {
      eventId: event.id,
      type: event.type,
      createdAt: event.created,
    });
  } catch (error) {
    console.error("stripe_webhook_sync_failed", error);
    return NextResponse.json({ ok: false, error: "billing_sync_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, received: true });
}
