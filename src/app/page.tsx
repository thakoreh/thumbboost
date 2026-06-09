"use client";

import { useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  ChartLineUp,
  Check,
  ClockCounterClockwise,
  DownloadSimple,
  Lightning,
  MagicWand,
  PaintBrush,
  PlayCircle,
  Sparkle,
  TrendUp,
  UploadSimple,
} from "@phosphor-icons/react";

type Thumb = {
  id: string;
  title: string;
  subtitle: string;
  palette: string[];
  score: number;
  style: string;
  accent: string;
};

const palettes = [
  ["#0b1020", "#ff3d7f", "#ffcf32", "#ffffff"],
  ["#111827", "#22c55e", "#38bdf8", "#f8fafc"],
  ["#1f1300", "#f97316", "#facc15", "#fff7ed"],
  ["#171717", "#ef4444", "#f5f5f5", "#a3e635"],
  ["#09111f", "#06b6d4", "#f43f5e", "#f8fafc"],
  ["#201033", "#fb7185", "#fde047", "#fdf4ff"],
];

const sampleThumbs: Thumb[] = [
  {
    id: "sample-1",
    title: "I tested 47 AI agents",
    subtitle: "Only 3 survived",
    palette: palettes[0],
    score: 91,
    style: "High contrast creator shock",
    accent: "Diagonal alert banner",
  },
  {
    id: "sample-2",
    title: "Build a SaaS in one day",
    subtitle: "From prompt to checkout",
    palette: palettes[1],
    score: 87,
    style: "Clean tech tutorial",
    accent: "Glass panel breakdown",
  },
  {
    id: "sample-3",
    title: "This thumbnail doubled CTR",
    subtitle: "Trend teardown",
    palette: palettes[2],
    score: 94,
    style: "Warm viral case study",
    accent: "Oversized proof badge",
  },
];

const trendSignals = [
  "Oversized face crop with one emotional focal point",
  "Yellow or lime proof badge in top-left safe zone",
  "Three-word headline, maximum two visual subjects",
  "High edge contrast around objects for mobile feeds",
  "One saturated accent on charcoal or warm shadow base",
];

function makeThumbs(title: string, channel: string, keywords: string): Thumb[] {
  const seed = `${title} ${channel} ${keywords}`.trim() || "viral creator thumbnail";
  const words = seed.split(/\s+/).filter(Boolean);
  return palettes.map((palette, index) => ({
    id: `${Date.now()}-${index}`,
    title: title || ["I tried", words[0] || "the", "new trend"].join(" "),
    subtitle:
      index % 2 === 0
        ? `${channel || "Creator Lab"} verdict`
        : `${keywords || "CTR-ready style"}`,
    palette,
    score: Math.min(98, 72 + ((seed.length + index * 7) % 27)),
    style:
      [
        "MrBeast-inspired proof stack",
        "Creator tech breakdown",
        "Reaction face with evidence",
        "Minimal premium tutorial",
        "Dark lab experiment",
        "Warm viral comparison",
      ][index] || "Trend adaptive",
    accent:
      [
        "Arrow callout",
        "Split before-after",
        "Glow cutout",
        "Big numeric hook",
        "Face-safe text zone",
        "Mobile-first contrast",
      ][index] || "Safe-zone headline",
  }));
}

function scorePrompt(title: string, description: string, keywords: string) {
  const text = `${title} ${description} ${keywords}`.toLowerCase();
  let score = 52;
  if (title.length > 15 && title.length < 70) score += 10;
  if (/tested|tried|secret|mistake|before|after|better|worst|best/.test(text)) score += 12;
  if (/\d/.test(text)) score += 8;
  if (keywords.split(",").filter((k) => k.trim()).length >= 2) score += 7;
  if (description.length > 80) score += 6;
  return Math.min(score, 96);
}

function ThumbnailCard({ thumb, overlay, watermark = false }: { thumb: Thumb; overlay: string; watermark?: boolean }) {
  return (
    <div
      data-thumb-id={thumb.id}
      className="group relative aspect-video overflow-hidden rounded-[1.75rem] border border-white/10 shadow-2xl shadow-black/30"
      style={{ background: `linear-gradient(135deg, ${thumb.palette[0]}, ${thumb.palette[1]})` }}
    >
      <div className="absolute inset-0 opacity-45 thumb-grid" />
      <div
        className="absolute -right-10 -top-10 h-44 w-44 rounded-full blur-2xl transition-transform duration-500 group-hover:scale-125"
        style={{ background: thumb.palette[2] }}
      />
      <div
        className="absolute -bottom-16 left-6 h-48 w-48 rounded-full blur-3xl"
        style={{ background: thumb.palette[1] }}
      />
      <div className="absolute left-5 top-5 rounded-full border border-white/25 bg-black/35 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur">
        {thumb.score}% CTR signal
      </div>
      <div className="absolute right-5 top-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-zinc-950 shadow-xl rotate-3">
        <PlayCircle size={34} weight="fill" />
      </div>
      <div className="absolute inset-x-5 bottom-5">
        <div className="mb-3 inline-flex rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-zinc-950" style={{ background: thumb.palette[2] }}>
          {thumb.accent}
        </div>
        <h3 className="max-w-[82%] text-balance text-3xl font-black uppercase leading-[0.9] tracking-[-0.06em] text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.75)] md:text-4xl">
          {overlay || thumb.title}
        </h3>
        <p className="mt-2 max-w-[72%] text-sm font-semibold text-white/85">{thumb.subtitle}</p>
      </div>
      {watermark && (
        <div className="absolute bottom-4 right-4 rounded-full border border-white/25 bg-black/45 px-3 py-1 text-xs font-bold text-white/80 backdrop-blur">
          ThumbAI free
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [title, setTitle] = useState("I Let AI Build My Startup for 24 Hours");
  const [description, setDescription] = useState("A fast-paced creator video comparing AI agents, cost, mistakes, and the final working product.");
  const [channel, setChannel] = useState("Hiren Ships");
  const [keywords, setKeywords] = useState("AI agents, SaaS, challenge, viral");
  const [overlay, setOverlay] = useState("AI built my startup");
  const [selected, setSelected] = useState(0);
  const [loading, setLoading] = useState(false);
  const [thumbs, setThumbs] = useState<Thumb[]>(sampleThumbs);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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
      if (data.thumbnails?.length) {
        setThumbs(data.thumbnails);
      } else {
        setThumbs(generated);
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
    ctx.fillText("ThumbAI demo", 1030, 676);
    const link = document.createElement("a");
    link.download = "thumbai-thumbnail.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <main className="min-h-[100dvh] overflow-hidden bg-[#0d0f14] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,61,127,0.22),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(250,204,21,0.18),transparent_28%),linear-gradient(180deg,#0d0f14,#151516_44%,#0d0f14)]" />
      <div className="relative mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between rounded-full border border-white/10 bg-white/[0.06] px-5 py-3 backdrop-blur-xl">
          <a href="#top" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#facc15] text-zinc-950"><Sparkle size={20} weight="fill" /></span>
            <span className="text-lg font-black tracking-[-0.04em]">ThumbAI</span>
          </a>
          <div className="hidden items-center gap-6 text-sm font-semibold text-white/70 md:flex">
            <a href="#studio" className="hover:text-white">Studio</a>
            <a href="#trends" className="hover:text-white">Trends</a>
            <a href="#pricing" className="hover:text-white">Pricing</a>
          </div>
          <a href="#studio" className="rounded-full bg-white px-4 py-2 text-sm font-bold text-zinc-950 transition active:scale-[0.98]">Generate</a>
        </nav>

        <section id="top" className="grid min-h-[86dvh] items-center gap-10 py-16 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white/75">
              <Lightning size={15} weight="fill" /> Trend-adaptive thumbnail generator
            </div>
            <h1 className="max-w-4xl text-balance text-5xl font-black leading-[0.88] tracking-[-0.075em] md:text-7xl">
              Turn video ideas into thumbnails creators can actually ship.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/68">
              Prompt-first SaaS studio for YouTube-style thumbnails: generate variations, edit text overlays, adapt to niche trends, predict click appeal, and export high-res PNGs.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#studio" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#facc15] px-6 py-3 font-black text-zinc-950 transition hover:-translate-y-0.5 active:scale-[0.98]">
                Open creator dashboard <ArrowRight size={18} weight="bold" />
              </a>
              <a href="#examples" className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 font-bold text-white/85 transition hover:bg-white/10 active:scale-[0.98]">
                View examples
              </a>
            </div>
            <div className="mt-8 grid max-w-xl grid-cols-3 gap-3 text-sm">
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4"><strong className="block text-2xl text-white">Demo</strong><span className="text-white/55">watermarked exports in MVP</span></div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4"><strong className="block text-2xl text-white">6</strong><span className="text-white/55">variations per prompt</span></div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4"><strong className="block text-2xl text-white">16:9</strong><span className="text-white/55">YouTube-ready canvas</span></div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 rounded-[2.5rem] bg-[#facc15]/10 blur-3xl" />
            <div className="relative rounded-[2.25rem] border border-white/12 bg-white/[0.06] p-3 shadow-2xl backdrop-blur-2xl">
              <ThumbnailCard thumb={sampleThumbs[0]} overlay="AI built my startup" />
              <div className="mt-3 grid grid-cols-2 gap-3">
                {sampleThumbs.slice(1).map((thumb) => <ThumbnailCard key={thumb.id} thumb={thumb} overlay="CTR doubled" />)}
              </div>
            </div>
          </div>
        </section>

        <section id="studio" className="grid gap-4 rounded-[2rem] border border-white/10 bg-[#111318]/90 p-4 shadow-2xl backdrop-blur-xl lg:grid-cols-[380px_1fr]">
          <aside className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#facc15]">Creator prompt</p>
                <h2 className="text-2xl font-black tracking-[-0.05em]">Generate</h2>
              </div>
              <MagicWand className="text-[#facc15]" size={26} weight="fill" />
            </div>
            <div className="space-y-4">
              <label className="block"><span className="mb-2 block text-sm font-bold text-white/78">Video title</span><input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm outline-none transition focus:border-[#facc15]" /></label>
              <label className="block"><span className="mb-2 block text-sm font-bold text-white/78">Description</span><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm outline-none transition focus:border-[#facc15]" /></label>
              <label className="block"><span className="mb-2 block text-sm font-bold text-white/78">Channel name</span><input value={channel} onChange={(e) => setChannel(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm outline-none transition focus:border-[#facc15]" /></label>
              <label className="block"><span className="mb-2 block text-sm font-bold text-white/78">Keywords or reference style</span><input value={keywords} onChange={(e) => setKeywords(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm outline-none transition focus:border-[#facc15]" /></label>
              <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-white/15 bg-white/[0.04] px-4 py-3 text-sm font-bold text-white/65"><UploadSimple size={17} /> Optional reference image</button>
              <button onClick={generate} disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#facc15] px-5 py-4 font-black text-zinc-950 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]">
                {loading ? "Queued generation..." : "Generate 6 thumbnails"} <ArrowRight size={18} weight="bold" />
              </button>
            </div>
          </aside>

          <div className="grid gap-4 xl:grid-cols-[1fr_300px]">
            <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-4">
              <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/45">Live previews</p>
                  <h2 className="text-2xl font-black tracking-[-0.05em]">Gallery variations</h2>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-2 text-sm font-bold text-white/70"><ClockCounterClockwise size={16} /> Queue ready</div>
              </div>
              {loading ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {Array.from({ length: 4 }).map((_, i) => <div key={i} className="aspect-video animate-pulse rounded-[1.75rem] bg-white/10" />)}
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {thumbs.map((thumb, index) => (
                    <button key={thumb.id} onClick={() => setSelected(index)} className={`text-left transition hover:-translate-y-1 active:scale-[0.98] ${selected === index ? "ring-2 ring-[#facc15] rounded-[1.85rem]" : ""}`}>
                      <ThumbnailCard thumb={thumb} overlay={overlay} watermark={index === 0} />
                    </button>
                  ))}
                </div>
              )}
            </section>

            <aside className="space-y-4">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
                <div className="mb-4 flex items-center gap-2"><PaintBrush className="text-[#facc15]" size={20} weight="fill" /><h3 className="font-black">Quick editor</h3></div>
                <label className="block"><span className="mb-2 block text-sm font-bold text-white/70">Overlay text</span><input value={overlay} onChange={(e) => setOverlay(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm outline-none focus:border-[#facc15]" /></label>
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-bold text-white/60">
                  {['Impact', 'Anton', 'Bebas', 'Geist'].map((font) => <button key={font} className="rounded-xl border border-white/10 px-3 py-2 hover:bg-white/10">{font}</button>)}
                </div>
                <button onClick={downloadActive} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 font-black text-zinc-950 transition active:scale-[0.98]"><DownloadSimple size={18} weight="bold" /> Download PNG</button>
                <canvas ref={canvasRef} className="hidden" />
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
                <div className="mb-3 flex items-center gap-2"><ChartLineUp className="text-[#facc15]" size={20} weight="fill" /><h3 className="font-black">Performance predictor</h3></div>
                <div className="text-5xl font-black tracking-[-0.06em]">{predictor}%</div>
                <p className="mt-2 text-sm leading-6 text-white/58">Heuristic score from title length, numeric hook, curiosity words, and niche specificity.</p>
              </div>
            </aside>
          </div>
        </section>

        <section id="trends" className="grid gap-8 py-20 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#facc15] px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-zinc-950"><TrendUp size={15} weight="fill" /> Data edge</div>
            <h2 className="text-4xl font-black leading-none tracking-[-0.06em] md:text-5xl">Trend-adaptive generator, not another prompt wrapper.</h2>
            <p className="mt-5 text-lg leading-8 text-white/62">ThumbAI can fetch YouTube trending data when a YouTube API key is configured, then use extracted title/trend signals to guide generation prompts. Manual thumbnail-set analysis is not implemented yet.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {trendSignals.map((signal, index) => (
              <div key={signal} className="rounded-[1.4rem] border border-white/10 bg-white/[0.045] p-5">
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-white text-zinc-950 text-sm font-black">{index + 1}</div>
                <p className="font-bold leading-6 text-white/82">{signal}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="examples" className="py-8">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-white/45">Before / after</p><h2 className="text-4xl font-black tracking-[-0.06em]">Creator examples</h2></div>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {sampleThumbs.map((thumb, index) => <ThumbnailCard key={thumb.id} thumb={thumb} overlay={["boring AI video", "ship faster", "CTR teardown"][index]} />)}
          </div>
        </section>

        <section id="pricing" className="py-20">
          <div className="mx-auto max-w-2xl text-center"><h2 className="text-4xl font-black tracking-[-0.06em]">Freemium pricing built for creators.</h2><p className="mt-3 text-white/60">Stripe-ready checkout route included. Swap env price IDs to go live.</p></div>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {[
              ["Free", "$0", "MVP demo", ["Watermarked demo exports", "Prompt generator", "Basic predictor"]],
              ["Basic", "$12/mo", "Checkout-ready", ["Stripe checkout route", "High-res downloads", "Rate-limited generations", "Provider env guards"]],
              ["Pro", "$25/mo", "Provider-ready", ["Trend API scaffold", "Supabase project schema", "Creator style presets in UI", "Share links require persistence"]],
            ].map(([name, price, tagline, features], index) => (
              <div key={name as string} className={`rounded-[1.75rem] border p-6 ${index === 2 ? "border-[#facc15] bg-[#facc15] text-zinc-950" : "border-white/10 bg-white/[0.045]"}`}>
                <p className="text-sm font-black uppercase tracking-[0.16em] opacity-70">{name as string}</p>
                <div className="mt-3 text-4xl font-black tracking-[-0.06em]">{price as string}</div>
                <p className="mt-2 font-bold opacity-70">{tagline as string}</p>
                <div className="mt-6 space-y-3">
                  {(features as string[]).map((feature) => <div key={feature} className="flex items-center gap-2 text-sm font-bold"><Check size={16} weight="bold" /> {feature}</div>)}
                </div>
                <button className={`mt-6 w-full rounded-2xl px-4 py-3 font-black transition active:scale-[0.98] ${index === 2 ? "bg-zinc-950 text-white" : "bg-white text-zinc-950"}`}>Start {name as string}</button>
              </div>
            ))}
          </div>
        </section>

        <footer className="border-t border-white/10 py-8 text-sm text-white/45">
          <div className="flex flex-col justify-between gap-3 sm:flex-row"><p>ThumbAI. Next.js, Tailwind, Supabase schema, Stripe route, OpenAI image route.</p><p>Rate limits and provider guards scaffolded; auth/history need Supabase wiring.</p></div>
        </footer>
      </div>
    </main>
  );
}
