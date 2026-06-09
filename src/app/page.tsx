import Link from "next/link";
import {
  ArrowRightIcon,
  ChartIcon,
  CheckCircleIcon,
  ClockIcon,
  LightningIcon,
  ShieldIcon,
  SparkleIcon,
  TrendIcon,
} from "@/components/static-icons";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ThumbnailCard } from "@/components/thumbnail-card";
import { caseStudies, competitorRows, sampleThumbs, trendSignals, workflowSteps } from "@/lib/thumbboost-content";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f4f6f8] text-zinc-950">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-full bg-[#111318]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 pb-16 pt-10 text-white sm:px-6 lg:grid-cols-[0.88fr_1.12fr] lg:px-8 lg:pb-24 lg:pt-16">
          <div className="flex flex-col justify-center">
            <div className="mb-6 flex max-w-md items-center gap-3 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-bold text-white/72">
              <LightningIcon size={17} className="text-[#facc15]" />
              Built for YouTube packaging, not generic image prompts
            </div>
            <h1 className="max-w-4xl text-balance text-5xl font-black leading-[0.9] tracking-tight sm:text-6xl lg:text-7xl">
              Pick the thumbnail angle before you publish.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/68">
              ThumbBoost scores the title, hook, niche, and mobile-readability signals behind a video idea, then generates CTR-focused thumbnail variants your channel can actually compare.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/studio"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#facc15] px-6 py-3 font-black text-zinc-950 transition hover:-translate-y-0.5 active:scale-[0.98]"
              >
                Run packaging check <ArrowRightIcon size={18} />
              </Link>
              <Link
                href="/examples"
                className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 font-bold text-white/85 transition hover:bg-white/10 active:scale-[0.98]"
              >
                See examples
              </Link>
            </div>
            <div className="mt-9 grid max-w-xl grid-cols-3 gap-3 text-sm">
              {[
                ["5 free", "monthly thumbnails"],
                ["6", "CTR angles per idea"],
                ["16:9", "mobile-first export"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                  <strong className="block text-2xl text-white">{value}</strong>
                  <span className="text-white/55">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[520px]">
            <div className="absolute -inset-8 rounded-[3rem] bg-[#facc15]/10 blur-3xl" />
            <div className="relative rounded-[2rem] border border-white/12 bg-white/[0.07] p-3 shadow-2xl backdrop-blur-2xl">
              <ThumbnailCard thumb={sampleThumbs[0]} overlay="AI built my startup" />
              <div className="mt-3 hidden grid-cols-2 gap-3 sm:grid">
                {sampleThumbs.slice(1).map((thumb) => (
                  <ThumbnailCard key={thumb.id} thumb={thumb} overlay={thumb.id === "sample-2" ? "ship faster" : "CTR teardown"} compact />
                ))}
              </div>
            </div>
            <div className="absolute -bottom-8 left-6 right-6 rounded-3xl border border-zinc-200 bg-white p-5 text-zinc-950 shadow-2xl shadow-black/20 sm:left-12 sm:right-auto sm:w-[360px]">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-zinc-500">Preflight score</p>
                  <p className="text-4xl font-black tracking-tight">91%</p>
                </div>
                <ChartIcon size={32} className="text-emerald-500" />
              </div>
              <div className="space-y-2 text-sm font-semibold text-zinc-600">
                <p className="flex items-center gap-2">
                  <CheckCircleIcon size={17} className="text-emerald-500" />
                  Three-word overlay fits mobile safe zone
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircleIcon size={17} className="text-emerald-500" />
                  Proof claim is visible before the click
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {workflowSteps.map((step, index) => (
            <article key={step.title} className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="mb-8 flex h-11 w-11 items-center justify-center rounded-full bg-zinc-950 text-sm font-black text-white">{index + 1}</div>
              <h2 className="text-2xl font-black tracking-tight">{step.title}</h2>
              <p className="mt-3 leading-7 text-zinc-600">{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#facc15] px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-zinc-950">
              <TrendIcon size={15} /> Competitive wedge
            </div>
            <h2 className="text-balance text-4xl font-black leading-none tracking-tight md:text-5xl">
              Intelligence first. Pixels second.
            </h2>
            <p className="mt-5 text-lg leading-8 text-zinc-600">
              Most creators already have design tools. ThumbBoost focuses on the decision they make before design polish: which title, hook, and thumbnail angle deserves the upload slot.
            </p>
          </div>
          <div className="overflow-hidden rounded-3xl border border-zinc-200">
            {competitorRows.map((row) => (
              <div key={row.name} className="grid gap-4 border-b border-zinc-200 bg-white p-5 last:border-b-0 md:grid-cols-[0.72fr_1fr_1fr]">
                <div>
                  <p className="font-black">{row.name}</p>
                  <p className="mt-1 text-sm text-zinc-500">{row.focus}</p>
                </div>
                <p className="text-sm leading-6 text-zinc-600">{row.gap}</p>
                <p className="text-sm font-bold leading-6 text-zinc-900">{row.thumbBoost}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="text-4xl font-black tracking-tight">Creator-ready examples</h2>
            <p className="mt-3 max-w-2xl leading-7 text-zinc-600">
              Each sample is framed like a packaging decision, not a decorative mockup.
            </p>
          </div>
          <Link href="/examples" className="inline-flex items-center gap-2 font-black text-zinc-950">
            View all examples <ArrowRightIcon size={18} />
          </Link>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {caseStudies.map((study) => (
            <article key={study.title} className="rounded-3xl border border-zinc-200 bg-white p-3 shadow-sm">
              <ThumbnailCard thumb={study.thumb} overlay={study.overlay} compact />
              <div className="p-4">
                <h3 className="text-xl font-black tracking-tight">{study.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">{study.result}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#111318] py-20 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-8">
          <div>
            <SparkleIcon size={30} className="text-[#facc15]" />
            <h2 className="mt-4 text-4xl font-black leading-none tracking-tight md:text-5xl">A tighter workflow for the messy pre-publish moment.</h2>
            <p className="mt-5 text-lg leading-8 text-white/65">
              Use it when a title feels close, a thumbnail concept is unclear, or a team needs more than “which one looks cooler?” before publishing.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/studio" className="inline-flex items-center justify-center rounded-full bg-[#facc15] px-6 py-3 font-black text-zinc-950">
                Open studio
              </Link>
              <Link href="/pricing" className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 font-bold text-white/85">
                Compare plans
              </Link>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {trendSignals.map((signal) => (
              <div key={signal} className="rounded-3xl border border-white/10 bg-white/[0.055] p-5">
                <ShieldIcon className="mb-5 text-[#facc15]" size={24} />
                <p className="font-bold leading-6 text-white/82">{signal}</p>
              </div>
            ))}
            <div className="rounded-3xl border border-white/10 bg-[#facc15] p-5 text-zinc-950">
              <ClockIcon className="mb-5" size={24} />
              <p className="font-black leading-6">Save each signed-in project to compare older ideas against fresh patterns.</p>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
