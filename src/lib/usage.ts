import type { PlanId } from "./plans";

export const FREE_THUMBNAILS_PER_MONTH = 5;
export const MAX_VARIATIONS_PER_REQUEST = 6;

type GenerationQuotaInput = {
  plan: PlanId;
  requestedVariations: number;
  thumbnailsThisMonth: number;
  lastUsageReset: number;
  now?: number;
};

export type GenerationQuota = {
  allowedVariations: number;
  remainingBeforeReservation: number | null;
  remainingAfterReservation: number | null;
  nextUsageCount: number;
  resetUsage: boolean;
  resetAt: number;
  quotaExceeded: boolean;
};

export function monthWindowStart(now = Date.now()) {
  const date = new Date(now);
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1);
}

function clampRequestedVariations(requestedVariations: number) {
  if (!Number.isFinite(requestedVariations)) return 1;
  return Math.min(Math.max(Math.floor(requestedVariations), 1), MAX_VARIATIONS_PER_REQUEST);
}

export function resolveGenerationQuota(input: GenerationQuotaInput): GenerationQuota {
  const now = input.now ?? Date.now();
  const resetAt = monthWindowStart(now);
  const resetUsage = input.lastUsageReset < resetAt;
  const currentUsage = resetUsage ? 0 : Math.max(0, Math.floor(input.thumbnailsThisMonth));
  const requested = clampRequestedVariations(input.requestedVariations);

  if (input.plan !== "free") {
    return {
      allowedVariations: requested,
      remainingBeforeReservation: null,
      remainingAfterReservation: null,
      nextUsageCount: currentUsage + requested,
      resetUsage,
      resetAt,
      quotaExceeded: false,
    };
  }

  const remainingBeforeReservation = Math.max(0, FREE_THUMBNAILS_PER_MONTH - currentUsage);
  const allowedVariations = Math.min(requested, remainingBeforeReservation);
  const remainingAfterReservation = remainingBeforeReservation - allowedVariations;

  return {
    allowedVariations,
    remainingBeforeReservation,
    remainingAfterReservation,
    nextUsageCount: currentUsage + allowedVariations,
    resetUsage,
    resetAt,
    quotaExceeded: allowedVariations === 0,
  };
}

export function resolveUsageAfterRefund({
  thumbnailsThisMonth,
  refundAmount,
}: {
  thumbnailsThisMonth: number;
  refundAmount: number;
}) {
  const currentUsage = Number.isFinite(thumbnailsThisMonth) ? Math.max(0, Math.floor(thumbnailsThisMonth)) : 0;
  const refund = Number.isFinite(refundAmount) ? Math.max(0, Math.floor(refundAmount)) : 0;
  return Math.max(0, currentUsage - refund);
}
