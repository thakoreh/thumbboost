export type PlanId = "free" | "basic" | "pro";

export const plans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    priceEnv: null,
    headline: "Try packaging intelligence before paying",
    limitLabel: "5 thumbnails/month",
    features: ["5 watermarked thumbnails/month", "Prompt + title score", "Mobile-readability predictor", "Clean private history"],
  },
  {
    id: "basic",
    name: "Basic",
    price: 12,
    priceEnv: "STRIPE_BASIC_PRICE_ID",
    headline: "Clean thumbnail exports for solo creators",
    limitLabel: "Clean exports",
    features: ["Watermark-free PNG exports", "Six CTR-angle variants per request", "Saved project history", "Self-service billing portal"],
  },
  {
    id: "pro",
    name: "Pro",
    price: 25,
    priceEnv: "STRIPE_PRO_PRICE_ID",
    headline: "Trend-aware packaging workflow for serious channels",
    limitLabel: "Pro workspace",
    features: ["Everything in Basic", "Trend-signal prompt guidance", "Six-angle packaging workflow", "Self-service billing portal"],
  },
] as const;

export function getPlan(id?: string | null) {
  return plans.find((plan) => plan.id === id) || plans[0];
}

export function checkoutPlanId(id?: string | null): "basic" | "pro" | null {
  return id === "basic" || id === "pro" ? id : null;
}

export function planForPriceId(priceId?: string | null): PlanId | null {
  if (!priceId) return null;
  const match = plans.find((plan) => {
    const value = plan.priceEnv ? process.env[plan.priceEnv]?.trim() : undefined;
    return value === priceId;
  });
  return match?.id ?? null;
}

export function shouldWatermarkExport(plan?: PlanId | null) {
  return plan !== "basic" && plan !== "pro";
}
