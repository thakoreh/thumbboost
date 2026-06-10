import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#f4f6f8] text-zinc-950">
      <SiteHeader />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-zinc-500">Terms</p>
        <h1 className="mt-3 text-5xl font-black tracking-tight">Terms of Service</h1>
        <p className="mt-5 leading-8 text-zinc-600">Last updated: June 9, 2026</p>
        <div className="mt-10 space-y-8 rounded-3xl border border-zinc-200 bg-white p-8 leading-8 text-zinc-700 shadow-sm">
          <section>
            <h2 className="text-2xl font-black text-zinc-950">Use of ThumbBoost</h2>
            <p className="mt-3">ThumbBoost helps creators generate and compare YouTube thumbnail concepts. You are responsible for the prompts you submit, the final thumbnail you publish, and compliance with YouTube and copyright rules.</p>
          </section>
          <section>
            <h2 className="text-2xl font-black text-zinc-950">Generated outputs</h2>
            <p className="mt-3">Generated images may be imperfect. Review every export before publishing. Do not use outputs to impersonate people, violate rights, or create misleading harmful content.</p>
          </section>
          <section>
            <h2 className="text-2xl font-black text-zinc-950">Subscriptions</h2>
            <p className="mt-3">Paid plans renew monthly through Stripe unless cancelled. Plan limits and features may change as the product evolves, but active users will receive reasonable notice of material changes.</p>
          </section>
          <section>
            <h2 className="text-2xl font-black text-zinc-950">Availability</h2>
            <p className="mt-3">The service is provided as-is. We work to keep generation reliable, but provider outages, rate limits, or billing issues can affect availability.</p>
          </section>
          <section>
            <h2 className="text-2xl font-black text-zinc-950">Contact</h2>
            <p className="mt-3">Questions: support@thumbboost.app</p>
          </section>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
