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
    headline: "Unlimited basic thumbnails for solo creators",
    limitLabel: "Unlimited basic",
    features: ["Unlimited basic generations", "High-res PNG exports", "CTR angle variations", "No watermark on exports"],
  },
  {
    id: "pro",
    name: "Pro",
    price: 25,
    priceEnv: "STRIPE_PRO_PRICE_ID",
    headline: "Trend-adaptive workflow for serious channels",
    limitLabel: "Styles + history",
    features: ["Reusable style presets", "Trend-adaptive suggestions", "Project history", "Shareable review links"],
  },
] as const;

export function getPlan(id?: string | null) {
  return plans.find((plan) => plan.id === id) || plans[0];
}

export function planForPriceId(priceId?: string | null): PlanId | null {
  if (!priceId) return null;
  const match = plans.find((plan) => plan.priceEnv && process.env[plan.priceEnv] === priceId);
  return match?.id ?? null;
}
