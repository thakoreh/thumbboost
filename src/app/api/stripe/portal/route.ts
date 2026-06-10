import Stripe from "stripe";
import { auth } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { NextRequest, NextResponse } from "next/server";
import { hasClerkSecret } from "@/lib/auth-config";
import { billingPortalReturnUrl, canOpenBillingPortal } from "@/lib/billing";
import { runtimeEnv, serverConvexUrl } from "@/lib/env";
import { publicOrigin } from "@/lib/origin";
import { api } from "../../../../../convex/_generated/api";

export async function GET(request: NextRequest) {
  const stripeSecretKey = runtimeEnv("STRIPE_SECRET_KEY");
  if (!stripeSecretKey) {
    return NextResponse.json({ ok: false, error: "stripe_not_configured" }, { status: 503 });
  }
  if (!hasClerkSecret()) {
    return NextResponse.json({ ok: false, error: "auth_not_configured" }, { status: 503 });
  }

  const authState = await auth();
  const origin = publicOrigin(request);
  if (!authState.userId) {
    const redirectUrl = new URL("/sign-in", origin);
    redirectUrl.searchParams.set("redirect_url", "/api/stripe/portal");
    return NextResponse.redirect(redirectUrl, 307);
  }

  const convexUrl = serverConvexUrl();
  if (!convexUrl) {
    return NextResponse.json({ ok: false, error: "convex_not_configured" }, { status: 503 });
  }

  const token = await authState.getToken({ template: "convex" }).catch(() => null);
  if (!token) {
    return NextResponse.json({ ok: false, error: "convex_auth_unavailable" }, { status: 503 });
  }

  const convex = new ConvexHttpClient(convexUrl);
  convex.setAuth(token);
  const user = await convex.query(api.users.getCurrentUser, {}).catch((error) => {
    console.error("convex_billing_portal_user_lookup_failed", authState.userId, error);
    return null;
  });
  const stripeCustomerId = user?.stripeCustomerId?.trim();
  if (!stripeCustomerId || !canOpenBillingPortal({ plan: user?.plan, stripeCustomerId })) {
    return NextResponse.redirect(new URL("/pricing?billing=missing_customer", origin), 307);
  }

  const stripe = new Stripe(stripeSecretKey, { apiVersion: "2026-05-27.dahlia" });
  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: billingPortalReturnUrl(origin),
  });

  if (!session.url) {
    return NextResponse.json({ ok: false, error: "billing_portal_url_missing" }, { status: 500 });
  }
  return NextResponse.redirect(session.url, 307);
}
