type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export function resolveRateLimit({
  bucket,
  max,
  windowMs,
  now,
}: {
  bucket: Bucket | null;
  max: number;
  windowMs: number;
  now: number;
}) {
  if (!bucket || bucket.resetAt < now) {
    const resetAt = now + windowMs;
    return { ok: true, count: 1, remaining: Math.max(0, max - 1), resetAt };
  }

  if (bucket.count >= max) {
    return { ok: false, count: bucket.count, remaining: 0, resetAt: bucket.resetAt };
  }

  const count = bucket.count + 1;
  return { ok: true, count, remaining: Math.max(0, max - count), resetAt: bucket.resetAt };
}

export function rateLimit(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const bucket = buckets.get(key);
  const result = resolveRateLimit({ bucket: bucket ?? null, max, windowMs, now });
  buckets.set(key, { count: result.count, resetAt: result.resetAt });
  return { ok: result.ok, remaining: result.remaining, resetAt: result.resetAt };
}

export async function serverRateLimit({
  key,
  max,
  windowMs,
  checkSharedLimit,
}: {
  key: string;
  max: number;
  windowMs: number;
  checkSharedLimit?: (input: { key: string; max: number; windowMs: number }) => Promise<{ ok: boolean; remaining: number; resetAt: number }>;
}) {
  if (checkSharedLimit) {
    try {
      return await checkSharedLimit({ key, max, windowMs });
    } catch (error) {
      console.error("shared_rate_limit_failed", error);
    }
  }

  return rateLimit(key, max, windowMs);
}
