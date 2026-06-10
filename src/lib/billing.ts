import type { PlanId } from "./plans";

type BillingIdentityInput = {
  email?: string | null;
  clerkUserId?: string | null;
  stripeCustomerId?: string | null;
};

export function normalizeBillingIdentity(input: BillingIdentityInput) {
  const clerkUserId = input.clerkUserId?.trim() || undefined;
  const stripeCustomerId = input.stripeCustomerId?.trim() || undefined;
  const normalizedEmail = input.email?.trim().toLowerCase();
  const email =
    normalizedEmail ||
    (clerkUserId ? `${clerkUserId}@clerk.billing.thumbboost.local` : undefined) ||
    (stripeCustomerId ? `${stripeCustomerId}@stripe.billing.thumbboost.local` : undefined);

  return {
    email,
    clerkUserId,
    stripeCustomerId,
  };
}

export function isPlanId(value?: string | null): value is PlanId {
  return value === "free" || value === "basic" || value === "pro";
}

export function planFromBillingSignal({
  status,
  candidatePlan,
}: {
  status?: string | null;
  candidatePlan?: string | null;
}): PlanId {
  if ((status === "active" || status === "trialing") && isPlanId(candidatePlan)) {
    return candidatePlan;
  }

  return "free";
}

export function billingPortalReturnUrl(origin: string) {
  return `${origin.replace(/\/$/, "")}/studio?billing=portal_return`;
}

export function canOpenBillingPortal({
  plan,
  stripeCustomerId,
}: {
  plan?: PlanId | null;
  stripeCustomerId?: string | null;
}) {
  return Boolean((plan === "basic" || plan === "pro") && stripeCustomerId?.trim());
}
