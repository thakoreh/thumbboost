"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { SignInButton, SignUpButton, Show, UserButton, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { plans } from "@/lib/plans";
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
  imageUrl?: string;
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
          ThumbBoost free
        </div>
      )}
    </div>
  );
}

function AuthControls() {
  return (
    <div className="flex items-center gap-2">
      <Show when="signed-out">
        <SignInButton mode="modal">
          <button className="rounded-full border border-white/15 px-4 py-2 text-sm font-bold text-white/80 transition hover:bg-white/10">Sign in</button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button className="rounded-full bg-white px-4 py-2 text-sm font-black text-zinc-950 transition active:scale-[0.98]">Start free</button>
        </SignUpButton>
      </Show>
      <Show when="signed-in">
        <a href="#studio" className="hidden rounded-full bg-[#facc15] px-4 py-2 text-sm font-black text-zinc-950 sm:inline-flex">Studio</a>
        <UserButton />
      </Show>
    </div>
  );
}

export default function Home() {
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
    <main className="min-h-[100dvh] overflow-hidden bg-[#0d0f14] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,61,127,0.22),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(250,204,21,0.18),transparent_28%),linear-gradient(180deg,#0d0f14,#151516_44%,#0d0f14)]" />
      <div className="relative mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between rounded-full border border-white/10 bg-white/[0.06] px-5 py-3 backdrop-blur-xl">
          <a href="#top" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#facc15] text-zinc-950"><Sparkle size={20} weight="fill" /></span>
            <span className="text-lg font-black tracking-[-0.04em]">ThumbBoost</span>
          </a>
          <div className="hidden items-center gap-6 text-sm font-semibold text-white/70 md:flex">
            <a href="#studio" className="hover:text-white">Studio</a>
            <a href="#trends" className="hover:text-white">Trends</a>
            <a href="#pricing" className="hover:text-white">Pricing</a>
          </div>
          <AuthControls />
        </nav>

        <section id="top" className="grid min-h-[86dvh] items-center gap-10 py-16 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white/75">
              <Lightning size={15} weight="fill" /> YouTube packaging intelligence
            </div>
            <h1 className="max-w-4xl text-balance text-5xl font-black leading-[0.88] tracking-[-0.075em] md:text-7xl">
              Find the thumbnail angle worth shipping before you publish.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/68">
              ThumbBoost positions against generic AI image tools: analyze the title, niche, hook, and mobile-readability signals, then generate packaging variants built for creator CTR decisions.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#studio" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#facc15] px-6 py-3 font-black text-zinc-950 transition hover:-translate-y-0.5 active:scale-[0.98]">
                Run packaging check <ArrowRight size={18} weight="bold" />
              </a>
              <a href="#examples" className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 font-bold text-white/85 transition hover:bg-white/10 active:scale-[0.98]">
                View examples
              </a>
            </div>
            <div className="mt-8 grid max-w-xl grid-cols-3 gap-3 text-sm">
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4"><strong className="block text-2xl text-white">5 free</strong><span className="text-white/55">monthly thumbnails</span></div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4"><strong className="block text-2xl text-white">6</strong><span className="text-white/55">CTR angles per idea</span></div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4"><strong className="block text-2xl text-white">16:9</strong><span className="text-white/55">mobile-first canvas</span></div>
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
                {loading ? "Queued generation..." : "Generate 6 CTR angles"} <ArrowRight size={18} weight="bold" />
              </button>
            </div>
          </aside>

          <div className="grid gap-4 xl:grid-cols-[1fr_300px]">
            <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-4">
              <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/45">Live previews</p>
                  <h2 className="text-2xl font-black tracking-[-0.05em]">Packaging variations</h2>
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
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
                <div className="mb-3 flex items-center gap-2"><ClockCounterClockwise className="text-[#facc15]" size={20} weight="fill" /><h3 className="font-black">Your history</h3></div>
                <p className="text-sm text-white/55">{currentUser ? `${currentUser.plan.toUpperCase()} plan · ${currentUser.thumbnailsThisMonth} thumbnails this month` : "Sign up to save every generation."}</p>
                <div className="mt-4 space-y-3">
                  {history === undefined ? <div className="h-16 animate-pulse rounded-2xl bg-white/10" /> : history.length === 0 ? <div className="rounded-2xl border border-dashed border-white/15 p-4 text-sm font-semibold text-white/55">Clean slate: no saved thumbnail projects yet.</div> : history.slice(0, 4).map((project) => <div key={project._id} className="rounded-2xl border border-white/10 bg-black/20 p-3"><p className="truncate text-sm font-black">{project.title}</p><p className="mt-1 text-xs text-white/45">{project.variations.length} variants · {new Date(project.createdAt).toLocaleDateString()}</p></div>)}
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section id="trends" className="grid gap-8 py-20 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#facc15] px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-zinc-950"><TrendUp size={15} weight="fill" /> Data edge</div>
            <h2 className="text-4xl font-black leading-none tracking-[-0.06em] md:text-5xl">Positioned against Pikzels-style generators: intelligence first, pixels second.</h2>
            <p className="mt-5 text-lg leading-8 text-white/62">Market research shows generic AI thumbnail generation is crowded. ThumbBoost narrows to YouTube packaging: title + thumbnail scoring, competitor-pattern prompts, mobile-safe layouts, and old-video revival workflows.</p>
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
            <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-white/45">Positioning wedge</p><h2 className="text-4xl font-black tracking-[-0.06em]">CTR-first examples</h2></div>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {sampleThumbs.map((thumb, index) => <ThumbnailCard key={thumb.id} thumb={thumb} overlay={["boring AI video", "ship faster", "CTR teardown"][index]} />)}
          </div>
        </section>

        <section id="pricing" className="py-20">
          <div className="mx-auto max-w-2xl text-center"><h2 className="text-4xl font-black tracking-[-0.06em]">Pricing anchored below full packaging suites.</h2><p className="mt-3 text-white/60">Pikzels sells AI packaging around $28-$56/mo annually and ThumbnailTest sells testing workflows. ThumbBoost starts cheaper as a focused packaging preflight.</p></div>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {plans.map((plan) => (
              <div key={plan.id} className={`rounded-[1.75rem] border p-6 ${plan.id === "pro" ? "border-[#facc15] bg-[#facc15] text-zinc-950" : "border-white/10 bg-white/[0.045]"}`}>
                <p className="text-sm font-black uppercase tracking-[0.16em] opacity-70">{plan.name}</p>
                <div className="mt-3 text-4xl font-black tracking-[-0.06em]">${plan.price}{plan.price ? <span className="text-base">/mo</span> : null}</div>
                <p className="mt-2 font-bold opacity-70">{plan.headline}</p>
                <p className="mt-3 rounded-full border border-current/20 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] opacity-75">{plan.limitLabel}</p>
                <div className="mt-6 space-y-3">
                  {plan.features.map((feature) => <div key={feature} className="flex items-center gap-2 text-sm font-bold"><Check size={16} weight="bold" /> {feature}</div>)}
                </div>
                {plan.price ? <a href={`/api/stripe/checkout?plan=${plan.id}`} className={`mt-6 flex w-full justify-center rounded-2xl px-4 py-3 font-black transition active:scale-[0.98] ${plan.id === "pro" ? "bg-zinc-950 text-white" : "bg-white text-zinc-950"}`}>Start {plan.name}</a> : <SignUpButton mode="modal"><button className="mt-6 w-full rounded-2xl bg-white px-4 py-3 font-black text-zinc-950 transition active:scale-[0.98]">Start Free</button></SignUpButton>}
              </div>
            ))}
          </div>
        </section>

        <footer className="border-t border-white/10 py-8 text-sm text-white/45">
          <div className="flex flex-col justify-between gap-3 sm:flex-row"><p>ThumbBoost. YouTube packaging intelligence for creators and small channels.</p><p>Clerk auth, Convex history, Stripe billing, and AI provider guards are wired for launch.</p></div>
        </footer>
      </div>
    </main>
  );
}
