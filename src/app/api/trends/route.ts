import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { runtimeEnv, serverConvexUrl } from "@/lib/env";
import { serverRateLimit } from "@/lib/rate-limit";
import { api } from "../../../../convex/_generated/api";

const fallback = {
  niche: "creator tech",
  signals: [
    "Use one dominant emotional focal point",
    "Keep headline to three to five words",
    "Place proof badge in a top corner",
    "Use yellow or lime against charcoal for mobile contrast",
    "Avoid clutter: one face, one object, one claim",
  ],
};

async function checkSharedRateLimit(input: { key: string; max: number; windowMs: number }) {
  const convexUrl = serverConvexUrl();
  if (!convexUrl) throw new Error("convex_not_configured");
  const convex = new ConvexHttpClient(convexUrl);
  return await convex.mutation(api.rateLimits.check, input);
}

export async function GET(request: NextRequest) {
  const niche = request.nextUrl.searchParams.get("niche") || fallback.niche;
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "local";
  const limit = await serverRateLimit({
    key: `trends:${ip}`,
    max: 30,
    windowMs: 60 * 60 * 1000,
    checkSharedLimit: serverConvexUrl() ? checkSharedRateLimit : undefined,
  });
  if (!limit.ok) return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });

  const youtubeApiKey = runtimeEnv("YOUTUBE_API_KEY");
  if (!youtubeApiKey) {
    return NextResponse.json({ ok: true, provider: "mock", ...fallback, niche });
  }

  const url = new URL("https://www.googleapis.com/youtube/v3/videos");
  url.searchParams.set("part", "snippet,statistics");
  url.searchParams.set("chart", "mostPopular");
  url.searchParams.set("maxResults", "12");
  url.searchParams.set("key", youtubeApiKey);

  const response = await fetch(url);
  if (!response.ok) return NextResponse.json({ ok: true, provider: "fallback", ...fallback, niche });
  const data = await response.json();
  const titles = (data.items || []).map((item: { snippet?: { title?: string } }) => item.snippet?.title).filter(Boolean);

  return NextResponse.json({
    ok: true,
    provider: "youtube",
    niche,
    titles,
    signals: fallback.signals,
  });
}
