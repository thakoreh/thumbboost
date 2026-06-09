import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ArrowRightIcon, CheckIcon, ShieldIcon } from "@/components/static-icons";
import { competitorRows, faqs } from "@/lib/thumbboost-content";
import { plans } from "@/lib/plans";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#f4f6f8] text-zinc-950">
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-4 pb-12 pt-12 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="text-balance text-5xl font-black leading-none tracking-tight md:text-6xl">
            Pricing for pre-publish packaging decisions.
          </h1>
          <p className="mt-5 text-lg leading-8 text-zinc-600">
            Start with a free packaging check, then upgrade when you need unlimited experiments, clean exports, reusable styles, and creator history.
          </p>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <article key={plan.id} className={`rounded-3xl border p-6 shadow-sm ${plan.id === "pro" ? "border-zinc-950 bg-zinc-950 text-white" : "border-zinc-200 bg-white"}`}>
              <p className={`text-sm font-black uppercase tracking-[0.14em] ${plan.id === "pro" ? "text-[#facc15]" : "text-zinc-500"}`}>{plan.name}</p>
              <div className="mt-4 text-5xl font-black tracking-tight">
                ${plan.price}
                {plan.price ? <span className="text-base font-bold opacity-70">/mo</span> : null}
              </div>
              <p className={`mt-3 min-h-14 font-bold leading-7 ${plan.id === "pro" ? "text-white/70" : "text-zinc-600"}`}>{plan.headline}</p>
              <p className={`mt-4 inline-flex rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.12em] ${plan.id === "pro" ? "border-white/20 text-white/75" : "border-zinc-200 text-zinc-500"}`}>
                {plan.limitLabel}
              </p>
              <div className="mt-7 space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm font-bold">
                  <CheckIcon size={16} className={plan.id === "pro" ? "text-[#facc15]" : "text-emerald-500"} />
                    {feature}
                  </div>
                ))}
              </div>
              {plan.price ? (
                <Link
                  href={`/api/stripe/checkout?plan=${plan.id}`}
                  className={`mt-8 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 font-black transition active:scale-[0.98] ${
                    plan.id === "pro" ? "bg-[#facc15] text-zinc-950" : "bg-zinc-950 text-white"
                  }`}
                >
                  Start {plan.name} <ArrowRightIcon size={18} />
                </Link>
              ) : (
                <Link href="/studio" className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-zinc-950 px-4 py-3 font-black text-white transition active:scale-[0.98]">
                  Try free <ArrowRightIcon size={18} />
                </Link>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.75fr_1.25fr] lg:px-8">
          <div>
            <ShieldIcon size={30} className="text-emerald-500" />
            <h2 className="mt-4 text-4xl font-black leading-none tracking-tight">Why not just use another tool?</h2>
            <p className="mt-4 leading-7 text-zinc-600">
              ThumbBoost is intentionally narrower: it helps creators decide which package to ship before the upload, then hands off to their preferred design and testing stack.
            </p>
          </div>
          <div className="overflow-hidden rounded-3xl border border-zinc-200">
            {competitorRows.map((row) => (
              <div key={row.name} className="grid gap-4 border-b border-zinc-200 p-5 last:border-b-0 md:grid-cols-[0.8fr_1fr_1fr]">
                <p className="font-black">{row.name}</p>
                <p className="text-sm leading-6 text-zinc-600">{row.focus}</p>
                <p className="text-sm font-bold leading-6">{row.thumbBoost}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-black tracking-tight">Questions creators ask before paying</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {faqs.map((faq) => (
            <article key={faq.question} className="rounded-3xl border border-zinc-200 bg-white p-6">
              <h3 className="font-black">{faq.question}</h3>
              <p className="mt-3 leading-7 text-zinc-600">{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#111318] px-4 py-16 text-center text-white sm:px-6 lg:px-8">
        <h2 className="mx-auto max-w-3xl text-4xl font-black leading-none tracking-tight">Run the free preflight before you choose a plan.</h2>
        <Link href="/studio" className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-[#facc15] px-6 py-3 font-black text-zinc-950">
          Open studio <ArrowRightIcon size={18} />
        </Link>
      </section>
      <SiteFooter />
    </main>
  );
}
