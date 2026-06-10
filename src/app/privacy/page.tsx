import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#f4f6f8] text-zinc-950">
      <SiteHeader />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-zinc-500">Privacy</p>
        <h1 className="mt-3 text-5xl font-black tracking-tight">Privacy Policy</h1>
        <p className="mt-5 leading-8 text-zinc-600">Last updated: June 9, 2026</p>
        <div className="mt-10 space-y-8 rounded-3xl border border-zinc-200 bg-white p-8 leading-8 text-zinc-700 shadow-sm">
          <section>
            <h2 className="text-2xl font-black text-zinc-950">What we collect</h2>
            <p className="mt-3">ThumbBoost collects the account details needed to run the product, such as your email address, generated project history, video packaging prompts, plan status, and billing identifiers from Stripe. We do not store full payment card numbers.</p>
          </section>
          <section>
            <h2 className="text-2xl font-black text-zinc-950">How we use data</h2>
            <p className="mt-3">We use your data to generate thumbnail concepts, save your history, enforce plan limits, process subscriptions, improve product quality, and prevent abuse.</p>
          </section>
          <section>
            <h2 className="text-2xl font-black text-zinc-950">Processors</h2>
            <p className="mt-3">ThumbBoost uses Clerk for authentication, Convex for app data, Stripe for billing, and OpenAI for image generation. Prompts may be sent to generation providers to fulfill your request.</p>
          </section>
          <section>
            <h2 className="text-2xl font-black text-zinc-950">Retention and control</h2>
            <p className="mt-3">You can contact support to request deletion of your saved projects or account data. Some billing records may be retained where required for tax, fraud prevention, or legal compliance.</p>
          </section>
          <section>
            <h2 className="text-2xl font-black text-zinc-950">Contact</h2>
            <p className="mt-3">Questions or deletion requests: support@thumbboost.app</p>
          </section>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
