import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

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

export async function GET(request: NextRequest) {
  const niche = request.nextUrl.searchParams.get("niche") || fallback.niche;
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "local";
  const limit = rateLimit(`trends:${ip}`, 30, 60 * 60 * 1000);
  if (!limit.ok) return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });

  if (!process.env.YOUTUBE_API_KEY) {
    return NextResponse.json({ ok: true, provider: "mock", ...fallback, niche });
  }

  const url = new URL("https://www.googleapis.com/youtube/v3/videos");
  url.searchParams.set("part", "snippet,statistics");
  url.searchParams.set("chart", "mostPopular");
  url.searchParams.set("maxResults", "12");
  url.searchParams.set("key", process.env.YOUTUBE_API_KEY);

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
