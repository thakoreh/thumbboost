import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ArrowRightIcon, ChartIcon, SparkleIcon } from "@/components/static-icons";
import { ThumbnailCard } from "@/components/thumbnail-card";
import { caseStudies, sampleThumbs, trendSignals } from "@/lib/thumbboost-content";

export default function ExamplesPage() {
  return (
    <main className="min-h-screen bg-[#f4f6f8] text-zinc-950">
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div>
            <SparkleIcon size={30} className="text-[#d39f00]" />
            <h1 className="mt-4 text-balance text-5xl font-black leading-none tracking-tight md:text-6xl">
              Examples that explain the packaging decision.
            </h1>
            <p className="mt-5 text-lg leading-8 text-zinc-600">
              ThumbBoost is most useful when it shows why one thumbnail angle is worth testing against another. These samples pair the visual output with the strategic reason.
            </p>
          </div>
          <div className="rounded-3xl border border-zinc-200 bg-white p-3 shadow-sm">
            <ThumbnailCard thumb={sampleThumbs[0]} overlay="AI built my startup" fontFamily="Impact, Arial Black, sans-serif" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-3">
          {caseStudies.map((study) => (
            <article key={study.title} className="rounded-3xl border border-zinc-200 bg-white p-3 shadow-sm">
              <ThumbnailCard thumb={study.thumb} overlay={study.overlay} fontFamily="Impact, Arial Black, sans-serif" compact />
              <div className="p-4">
                <p className="text-sm font-black uppercase tracking-[0.14em] text-zinc-500">{study.title}</p>
                <h2 className="mt-2 text-2xl font-black tracking-tight">{study.subtitle}</h2>
                <p className="mt-3 leading-7 text-zinc-600">{study.result}</p>
                <div className="mt-5 flex items-center gap-2 rounded-2xl bg-[#f4f6f8] px-4 py-3 text-sm font-black">
                  <ChartIcon size={18} className="text-emerald-500" />
                  {study.thumb.score}% packaging signal
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-4xl font-black tracking-tight">The signals ThumbBoost checks</h2>
            <p className="mt-4 leading-7 text-zinc-600">
              These are not promises of performance. They are practical packaging checks that keep creators from shipping hard-to-read, unfocused thumbnails.
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {trendSignals.map((signal, index) => (
              <div key={signal} className="rounded-3xl border border-zinc-200 bg-[#f4f6f8] p-5">
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-950 text-sm font-black text-white">{index + 1}</div>
                <p className="text-sm font-bold leading-6">{signal}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#111318] px-4 py-16 text-center text-white sm:px-6 lg:px-8">
        <h2 className="mx-auto max-w-3xl text-4xl font-black leading-none tracking-tight">Bring your next video idea into the studio.</h2>
        <Link href="/studio" className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-[#facc15] px-6 py-3 font-black text-zinc-950">
          Generate angles <ArrowRightIcon size={18} />
        </Link>
      </section>
      <SiteFooter />
    </main>
  );
}
