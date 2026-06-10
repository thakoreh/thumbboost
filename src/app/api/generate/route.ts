import OpenAI from "openai";
import { auth } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { NextRequest, NextResponse } from "next/server";
import { hasClerkSecret } from "@/lib/auth-config";
import { runtimeEnv, serverConvexUrl } from "@/lib/env";
import { serverRateLimit } from "@/lib/rate-limit";
import { api } from "../../../../convex/_generated/api";

const fallbackPalettes = [
  ["#0b1020", "#ff3d7f", "#ffcf32", "#ffffff"],
  ["#111827", "#22c55e", "#38bdf8", "#f8fafc"],
  ["#1f1300", "#f97316", "#facc15", "#fff7ed"],
  ["#171717", "#ef4444", "#f5f5f5", "#a3e635"],
  ["#09111f", "#06b6d4", "#f43f5e", "#f8fafc"],
  ["#201033", "#fb7185", "#fde047", "#fdf4ff"],
];

function mockThumbs(title: string, channel: string, keywords: string) {
  return fallbackPalettes.map((palette, index) => ({
    id: `fallback-${Date.now()}-${index}`,
    title: title || "Viral creator thumbnail",
    subtitle: channel || keywords || "Trend-adaptive preview",
    palette,
    score: Math.min(97, 78 + index * 3),
    style: ["Shock proof", "Tech tutorial", "Before-after", "Premium clean", "Experiment lab", "Warm viral"][index],
    accent: ["Arrow callout", "Split proof", "Glow cutout", "Big numeric hook", "Face-safe zone", "Mobile contrast"][index],
  }));
}

function imageUrlFromResult(image: { url?: string | null; b64_json?: string | null } | undefined) {
  if (image?.url) return image.url;
  if (image?.b64_json) return `data:image/png;base64,${image.b64_json}`;
  return undefined;
}

async function reserveQuota(userId: string, getToken: (options?: { template?: string }) => Promise<string | null>, requestedVariations: number) {
  const convexUrl = serverConvexUrl();
  if (!convexUrl) {
    return { ok: false as const, status: 503, error: "convex_not_configured" };
  }
  const token = await getToken({ template: "convex" }).catch(() => null);
  if (!token) {
    return { ok: false as const, status: 503, error: "convex_auth_unavailable" };
  }
  const convex = new ConvexHttpClient(convexUrl);
  convex.setAuth(token);
  try {
    const quota = await convex.mutation(api.users.reserveGenerationQuota, { requestedVariations });
    if (!quota.ok) {
      return {
        ok: false as const,
        status: 429,
        error: quota.error,
        plan: quota.plan,
        remaining: quota.remaining,
        resetAt: quota.resetAt,
      };
    }
    return { ok: true as const, allowedVariations: quota.allowedVariations, plan: quota.plan, remaining: quota.remaining, resetAt: quota.resetAt };
  } catch (error) {
    console.error("convex_quota_reservation_failed", userId, error);
    return { ok: false as const, status: 503, error: "quota_service_unavailable" };
  }
}

async function refundQuota(getToken: (options?: { template?: string }) => Promise<string | null>, amount: number) {
  const convexUrl = serverConvexUrl();
  if (!convexUrl || amount <= 0) return;
  const token = await getToken({ template: "convex" }).catch(() => null);
  if (!token) return;
  const convex = new ConvexHttpClient(convexUrl);
  convex.setAuth(token);
  await convex.mutation(api.users.refundGenerationQuota, { amount }).catch((error) => {
    console.error("convex_quota_refund_failed", error);
  });
}

async function checkSharedRateLimit(input: { key: string; max: number; windowMs: number }) {
  const convexUrl = serverConvexUrl();
  if (!convexUrl) throw new Error("convex_not_configured");
  const convex = new ConvexHttpClient(convexUrl);
  return await convex.mutation(api.rateLimits.check, input);
}

export async function POST(request: NextRequest) {
  const authState = hasClerkSecret() ? await auth() : { userId: null, getToken: async () => null };
  const { userId } = authState;
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "local";
  const limit = await serverRateLimit({
    key: `generate:${userId || ip}`,
    max: userId ? 20 : 3,
    windowMs: 60 * 60 * 1000,
    checkSharedLimit: serverConvexUrl() ? checkSharedRateLimit : undefined,
  });
  if (!limit.ok) {
    return NextResponse.json({ ok: false, error: "rate_limited", resetAt: limit.resetAt }, { status: 429 });
  }

  const body = await request.json().catch(() => ({}));
  const title = String(body.title || "").slice(0, 140);
  const description = String(body.description || "").slice(0, 800);
  const channel = String(body.channel || "").slice(0, 80);
  const keywords = String(body.keywords || "").slice(0, 220);
  if (![title, description, keywords].some((value) => value.trim().length > 0)) {
    return NextResponse.json({ ok: false, error: "missing_video_context" }, { status: 400 });
  }
  const requestedVariations = Math.min(Math.max(Number(body.variations || 4), 1), 6);
  const quota = userId ? await reserveQuota(userId, authState.getToken, requestedVariations) : null;
  if (quota && !quota.ok) {
    return NextResponse.json({ ok: false, error: quota.error, remaining: quota.remaining, resetAt: quota.resetAt }, { status: quota.status });
  }
  const variations = quota?.ok ? quota.allowedVariations : Math.min(requestedVariations, 1);

  const openaiApiKey = runtimeEnv("OPENAI_API_KEY");
  if (!openaiApiKey) {
    return NextResponse.json({
      ok: true,
      provider: "fallback",
      quota: quota?.ok ? { plan: quota.plan, remaining: quota.remaining, resetAt: quota.resetAt } : undefined,
      thumbnails: mockThumbs(title, channel, keywords).slice(0, variations),
    });
  }

  const openai = new OpenAI({ apiKey: openaiApiKey });
  const prompt = `Create a premium, high-converting YouTube thumbnail BACKGROUND for this video. Title: ${title}. Description: ${description}. Channel: ${channel}. Keywords/reference style: ${keywords}. Requirements: professional creator thumbnail quality, vibrant cinematic lighting, strong emotional focal subject or clear product/evidence object, high mobile contrast, bold composition, clean lower-left text-safe zone for app overlay, 16:9 crop-safe layout, no words, no letters, no numbers, no logos, no watermarks, no UI screenshots unless requested, no copyrighted character likenesses, no unsafe content. The app will add headline text separately, so the image must look polished without embedded text.`;
  const model = runtimeEnv("OPENAI_IMAGE_MODEL") || "gpt-image-1";
  const size = model === "dall-e-3" ? "1792x1024" : "1536x1024";

  try {
    const images = [];
    for (let i = 0; i < variations; i += 1) {
      const result = await openai.images.generate({
        model,
        prompt: `${prompt} Variation ${i + 1}: distinct composition and palette.`,
        size,
        n: 1,
      });
      images.push({
        id: `openai-${Date.now()}-${i}`,
        imageUrl: imageUrlFromResult(result.data?.[0]),
        title,
        subtitle: channel,
        palette: fallbackPalettes[i % fallbackPalettes.length],
        score: Math.min(97, 82 + i * 2),
        style: `${model} generated`,
        accent: "AI image",
      });
    }

    return NextResponse.json({
      ok: true,
      provider: "openai",
      model,
      quota: quota?.ok ? { plan: quota.plan, remaining: quota.remaining, resetAt: quota.resetAt } : undefined,
      thumbnails: images,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "image_generation_failed";
    console.error("openai_image_generation_failed", message);
    if (quota?.ok) await refundQuota(authState.getToken, variations);
    return NextResponse.json({
      ok: false,
      error: "image_generation_failed",
      quota: quota?.ok ? { plan: quota.plan, remaining: quota.remaining, resetAt: quota.resetAt } : undefined,
    }, { status: 502 });
  }
}
