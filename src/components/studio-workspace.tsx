"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import {
  ArrowRight,
  ChartLineUp,
  ClockCounterClockwise,
  DownloadSimple,
  MagicWand,
  PaintBrush,
  UploadSimple,
} from "@phosphor-icons/react";
import { api } from "../../convex/_generated/api";
import { makeThumbs, sampleThumbs, scorePrompt, trendSignals, type Thumb } from "@/lib/thumbboost-content";
import { ThumbnailCard } from "@/components/thumbnail-card";

const fontPresets = ["Impact", "Anton", "Bebas", "Geist"];

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
  const [selected, setSelected] = useState(0);
  const [loading, setLoading] = useState(false);
  const [thumbs, setThumbs] = useState<Thumb[]>(sampleThumbs);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (isSignedIn) ensureCurrentUser().catch(() => undefined);
  }, [ensureCurrentUser, isSignedIn]);

  const predictor = useMemo(() => scorePrompt(title, description, keywords), [title, description, keywords]);
  const activeThumb = thumbs[selected] || thumbs[0];

  async function generate() {
    setLoading(true);
    const generated = makeThumbs(title, channel, keywords);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, channel, keywords, variations: 6 }),
      });
      const data = await response.json();
      const nextThumbs = data.thumbnails?.length ? data.thumbnails : generated;
      setThumbs(nextThumbs);
      if (isSignedIn) {
        await createProject({
          title,
          description,
          channelName: channel,
          keywords: keywords.split(",").map((keyword) => keyword.trim()).filter(Boolean),
          style: nextThumbs[0]?.style,
          trendPrompt: trendSignals.slice(0, 3).join("; "),
          variations: nextThumbs,
        });
      }
    } catch {
      setThumbs(generated);
    } finally {
      setSelected(0);
      setLoading(false);
    }
  }

  function downloadActive() {
    if (!activeThumb) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = 1280;
    canvas.height = 720;
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
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.fillRect(60, 500, 760, 120);
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 76px Arial";
    ctx.fillText((overlay || activeThumb.title).toUpperCase().slice(0, 26), 75, 570);
    ctx.font = "700 34px Arial";
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
    ctx.fillText(currentUser?.plan === "free" ? "ThumbBoost free" : "ThumbBoost", 1030, 676);
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
          <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-white/15 bg-white/[0.04] px-4 py-3 text-sm font-bold text-white/65">
            <UploadSimple size={17} /> Optional reference image
          </button>
          <button
            onClick={generate}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#facc15] px-5 py-4 font-black text-zinc-950 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]"
          >
            {loading ? "Queued generation..." : "Generate 6 CTR angles"} <ArrowRight size={18} weight="bold" />
          </button>
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
                  <ThumbnailCard thumb={thumb} overlay={overlay} watermark={index === 0} compact />
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
            </label>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-bold text-white/60">
              {fontPresets.map((font) => (
                <button key={font} className="rounded-xl border border-white/10 px-3 py-2 hover:bg-white/10">
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
            <div className="mt-4 space-y-3">
              {history === undefined ? (
                <div className="h-16 animate-pulse rounded-2xl bg-white/10" />
              ) : history.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/15 p-4 text-sm font-semibold text-white/55">
                  Clean slate: no saved thumbnail projects yet.
                </div>
              ) : (
                history.slice(0, 4).map((project) => (
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
