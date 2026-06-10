"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import {
  ArrowRight,
  ChartLineUp,
  ClockCounterClockwise,
  CreditCard,
  DownloadSimple,
  MagicWand,
  PaintBrush,
} from "@phosphor-icons/react";
import { api } from "../../convex/_generated/api";
import { generationButtonLabel, generationProgressNotice } from "@/lib/generation-status";
import { makeThumbs, sampleThumbs, scorePrompt, trendSignals, type Thumb } from "@/lib/thumbboost-content";
import { shouldWatermarkExport } from "@/lib/plans";
import { ThumbnailCard } from "@/components/thumbnail-card";

const fontPresets = ["Impact", "Anton", "Bebas", "Geist"];
const canvasFontMap: Record<string, string> = {
  Impact: "Impact, Arial Black, sans-serif",
  Anton: "Anton, Impact, Arial Black, sans-serif",
  Bebas: "Bebas Neue, Impact, Arial Black, sans-serif",
  Geist: "Geist, Arial, sans-serif",
};

export function StudioWorkspace() {
  const { isSignedIn } = useUser();
  const ensureCurrentUser = useMutation(api.users.ensureCurrentUser);
  const createProject = useMutation(api.thumbnails.createProject);
  const history = useQuery(api.thumbnails.listMine);
  const currentUser = useQuery(api.users.getCurrentUser);
  const [title, setTitle] = useState("I Let AI Build My Startup for 24 Hours");
  const [description, setDescription] = useState("A fast-paced creator video comparing AI agents, cost, mistakes, and the final working product.");
  const [channel, setChannel] = useState("Hiren Ships");
  const [keywords, setKeywords] = useState("AI agents, SaaS, challenge, viral");
  const [overlay, setOverlay] = useState("AI built my startup");
  const [selectedFont, setSelectedFont] = useState("Impact");
  const [selected, setSelected] = useState(0);
  const [loading, setLoading] = useState(false);
  const [generationElapsed, setGenerationElapsed] = useState(0);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [generationNotice, setGenerationNotice] = useState<string | null>(null);
  const [thumbs, setThumbs] = useState<Thumb[]>(sampleThumbs);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (isSignedIn) ensureCurrentUser().catch(() => undefined);
  }, [ensureCurrentUser, isSignedIn]);

  useEffect(() => {
    if (!loading) return;
    const startedAt = Date.now();
    const interval = window.setInterval(() => {
      setGenerationElapsed(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [loading]);

  const predictor = useMemo(() => scorePrompt(title, description, keywords), [title, description, keywords]);
  const activeThumb = thumbs[selected] || thumbs[0];
  const overlayWordCount = overlay.trim().split(/\s+/).filter(Boolean).length;
  const overlayWarning = overlayWordCount > 6 ? "Keep overlay text to 1-4 words for mobile CTR." : "Overlay length is mobile-friendly.";
  const progressNotice = loading ? generationProgressNotice(generationElapsed) : null;

  async function generate() {
    if (![title, description, keywords].some((value) => value.trim().length > 0)) return;
    setGenerationElapsed(0);
    setLoading(true);
    setGenerationError(null);
    setGenerationNotice(null);
    const generated = makeThumbs(title, channel, keywords);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, channel, keywords, variations: 6 }),
      });
      const data = await response.json();
      if (!response.ok || data.ok === false) {
        const messages: Record<string, string> = {
          quota_exceeded: "Monthly free thumbnail quota reached. Upgrade to keep generating.",
          rate_limited: "Generation is temporarily rate-limited. Try again after the reset window.",
          convex_not_configured: "Project storage is not configured for signed-in generation.",
          convex_auth_unavailable: "Your account session could not authorize project storage. Sign out and back in.",
          quota_service_unavailable: "Usage tracking is temporarily unavailable. Try again shortly.",
          missing_video_context: "Add a title, description, or keyword before generating.",
          image_generation_failed: "Live image generation failed before any quota was charged. Please try again shortly.",
        };
        setGenerationError(messages[data.error as string] || "Generation failed. Try again with a shorter prompt.");
        return;
      }
      const nextThumbs: Thumb[] = data.thumbnails?.length ? data.thumbnails : generated;
      setThumbs(nextThumbs);
      if (data.provider === "fallback") {
        setGenerationNotice("Fallback previews shown because live image generation is unavailable.");
      } else if (data.quota?.remaining !== null && data.quota?.remaining !== undefined) {
        setGenerationNotice(`${data.quota.remaining} free thumbnails remain this month.`);
      }
      if (isSignedIn) {
        createProject({
          title,
          description,
          channelName: channel,
          keywords: keywords.split(",").map((keyword) => keyword.trim()).filter(Boolean),
          style: nextThumbs[0]?.style,
          trendPrompt: trendSignals.slice(0, 3).join("; "),
          variations: nextThumbs.map((thumb) => ({
            ...thumb,
            imageUrl: thumb.imageUrl?.startsWith("http") ? thumb.imageUrl : undefined,
          })),
        }).catch(() => undefined);
      }
    } catch {
      setGenerationError("Generation service is unreachable. Please try again shortly.");
    } finally {
      setSelected(0);
      setLoading(false);
    }
  }

  async function downloadActive() {
    if (!activeThumb) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = 1280;
    canvas.height = 720;

    if (activeThumb.imageUrl) {
      try {
        const image = await new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = activeThumb.imageUrl || "";
        });
        const sourceRatio = image.width / image.height;
        const targetRatio = canvas.width / canvas.height;
        let sx = 0;
        let sy = 0;
        let sw = image.width;
        let sh = image.height;
        if (sourceRatio > targetRatio) {
          sw = image.height * targetRatio;
          sx = (image.width - sw) / 2;
        } else {
          sh = image.width / targetRatio;
          sy = (image.height - sh) / 2;
        }
        ctx.drawImage(image, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
      } catch {
        ctx.fillStyle = activeThumb.palette[0];
        ctx.fillRect(0, 0, 1280, 720);
      }
      const vignette = ctx.createLinearGradient(0, 260, 0, 720);
      vignette.addColorStop(0, "rgba(0,0,0,0.05)");
      vignette.addColorStop(1, "rgba(0,0,0,0.82)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, 1280, 720);
    } else {
      const gradient = ctx.createLinearGradient(0, 0, 1280, 720);
      gradient.addColorStop(0, activeThumb.palette[0]);
      gradient.addColorStop(1, activeThumb.palette[1]);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1280, 720);
      ctx.fillStyle = activeThumb.palette[2];
      ctx.beginPath();
      ctx.arc(1050, 120, 190, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.12)";
      for (let x = 0; x < 1280; x += 64) ctx.fillRect(x, 0, 2, 720);
    }

    ctx.fillStyle = "rgba(0,0,0,0.48)";
    ctx.fillRect(52, 486, 820, 140);
    ctx.fillStyle = "#ffffff";
    ctx.font = `900 76px ${canvasFontMap[selectedFont] || canvasFontMap.Impact}`;
    ctx.fillText((overlay || activeThumb.title).toUpperCase().slice(0, 26), 75, 570);
    ctx.font = `700 34px ${canvasFontMap.Geist}`;
    ctx.fillText(activeThumb.subtitle.slice(0, 36), 80, 620);
    ctx.fillStyle = activeThumb.palette[2];
    ctx.fillRect(70, 70, 260, 58);
    ctx.fillStyle = "#111827";
    ctx.font = "900 28px Arial";
    ctx.fillText(`${activeThumb.score}% CTR`, 92, 108);
    ctx.fillStyle = "rgba(0,0,0,0.42)";
    ctx.fillRect(1010, 650, 220, 38);
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 22px Arial";
    ctx.fillText(shouldWatermarkExport(currentUser?.plan) ? "ThumbBoost free" : "ThumbBoost", 1030, 676);
    const link = document.createElement("a");
    link.download = "thumbboost-thumbnail.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <section className="grid gap-4 rounded-[2rem] border border-white/10 bg-[#111318]/90 p-4 shadow-2xl backdrop-blur-xl lg:grid-cols-[390px_1fr]">
      <aside className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#facc15]">Creator prompt</p>
            <h2 className="text-2xl font-black tracking-tight">Generate</h2>
          </div>
          <MagicWand className="text-[#facc15]" size={26} weight="fill" />
        </div>
        <div className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-white/78">Video title</span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm outline-none transition focus:border-[#facc15]"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-white/78">Description</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
              className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm outline-none transition focus:border-[#facc15]"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-white/78">Channel name</span>
            <input
              value={channel}
              onChange={(event) => setChannel(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm outline-none transition focus:border-[#facc15]"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-white/78">Keywords or reference style</span>
            <input
              value={keywords}
              onChange={(event) => setKeywords(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm outline-none transition focus:border-[#facc15]"
            />
          </label>
          <button
            onClick={generate}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#facc15] px-5 py-4 font-black text-zinc-950 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]"
          >
            {loading ? generationButtonLabel(generationElapsed) : isSignedIn ? "Generate 6 CTR angles" : "Generate 1 free angle"} <ArrowRight size={18} weight="bold" />
          </button>
          {generationError ? (
            <div className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-bold leading-5 text-red-100">
              {generationError}
            </div>
          ) : progressNotice ? (
            <div className="rounded-2xl border border-sky-300/25 bg-sky-400/10 px-4 py-3 text-sm font-bold leading-5 text-sky-100">
              {progressNotice}
            </div>
          ) : generationNotice ? (
            <div className="rounded-2xl border border-emerald-300/25 bg-emerald-400/10 px-4 py-3 text-sm font-bold leading-5 text-emerald-100">
              {generationNotice}
            </div>
          ) : null}
        </div>
      </aside>

      <div className="grid gap-4 xl:grid-cols-[1fr_310px]">
        <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-4">
          <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/45">Live previews</p>
              <h2 className="text-2xl font-black tracking-tight">Packaging variations</h2>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-2 text-sm font-bold text-white/70">
              <ClockCounterClockwise size={16} /> Queue ready
            </div>
          </div>
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="aspect-video animate-pulse rounded-3xl bg-white/10" />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {thumbs.map((thumb, index) => (
                <button
                  key={thumb.id}
                  onClick={() => setSelected(index)}
                  className={`text-left transition hover:-translate-y-1 active:scale-[0.98] ${
                    selected === index ? "rounded-[1.85rem] ring-2 ring-[#facc15]" : ""
                  }`}
                >
                  <ThumbnailCard thumb={thumb} overlay={overlay} fontFamily={canvasFontMap[selectedFont] || canvasFontMap.Impact} watermark={index === 0} compact />
                </button>
              ))}
            </div>
          )}
        </section>

        <aside className="space-y-4">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
            <div className="mb-4 flex items-center gap-2">
              <PaintBrush className="text-[#facc15]" size={20} weight="fill" />
              <h3 className="font-black">Quick editor</h3>
            </div>
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-white/70">Overlay text</span>
              <input
                value={overlay}
                onChange={(event) => setOverlay(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm outline-none focus:border-[#facc15]"
              />
              <span className={`mt-2 block text-xs font-bold ${overlayWordCount > 6 ? "text-amber-300" : "text-white/45"}`}>
                {overlayWarning}
              </span>
            </label>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-bold text-white/60">
              {fontPresets.map((font) => (
                <button
                  key={font}
                  type="button"
                  onClick={() => setSelectedFont(font)}
                  className={`rounded-xl border px-3 py-2 hover:bg-white/10 ${selectedFont === font ? "border-[#facc15] bg-[#facc15]/15 text-white" : "border-white/10"}`}
                  style={{ fontFamily: canvasFontMap[font] || canvasFontMap.Impact }}
                >
                  {font}
                </button>
              ))}
            </div>
            <button
              onClick={downloadActive}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 font-black text-zinc-950 transition active:scale-[0.98]"
            >
              <DownloadSimple size={18} weight="bold" /> Download PNG
            </button>
            <canvas ref={canvasRef} className="hidden" />
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
            <div className="mb-3 flex items-center gap-2">
              <ChartLineUp className="text-[#facc15]" size={20} weight="fill" />
              <h3 className="font-black">Performance predictor</h3>
            </div>
            <div className="text-5xl font-black tracking-tight">{predictor}%</div>
            <p className="mt-2 text-sm leading-6 text-white/58">
              Heuristic score from title length, numeric hook, curiosity words, and niche specificity.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
            <div className="mb-3 flex items-center gap-2">
              <ClockCounterClockwise className="text-[#facc15]" size={20} weight="fill" />
              <h3 className="font-black">Your history</h3>
            </div>
            <p className="text-sm text-white/55">
              {currentUser ? `${currentUser.plan.toUpperCase()} plan - ${currentUser.thumbnailsThisMonth} thumbnails this month` : "Sign up to save every generation."}
            </p>
            {currentUser?.plan === "basic" || currentUser?.plan === "pro" ? (
              <Link
                href="/api/stripe/portal"
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white px-4 py-3 text-sm font-black text-zinc-950 transition active:scale-[0.98]"
              >
                <CreditCard size={17} weight="bold" /> Manage billing
              </Link>
            ) : null}
            <div className="mt-4 space-y-3">
              {history === undefined ? (
                <div className="h-16 animate-pulse rounded-2xl bg-white/10" />
              ) : history.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/15 p-4 text-sm font-semibold text-white/55">
                  Clean slate: no saved thumbnail projects yet.
                </div>
              ) : (
                history.slice(0, 4).map((project: { _id: string; title: string; variations: unknown[]; createdAt: number }) => (
                  <div key={project._id} className="rounded-2xl border border-white/10 bg-black/20 p-3">
                    <p className="truncate text-sm font-black">{project.title}</p>
                    <p className="mt-1 text-xs text-white/45">
                      {project.variations.length} variants - {new Date(project.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
