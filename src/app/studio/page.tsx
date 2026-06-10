import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ArrowLeftIcon, ShieldIcon } from "@/components/static-icons";
import { StudioWorkspace } from "@/components/studio-workspace";

export default function StudioPage() {
  return (
    <main className="min-h-screen bg-[#0d0f14] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,61,127,0.18),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(250,204,21,0.16),transparent_28%),linear-gradient(180deg,#0d0f14,#151516_44%,#0d0f14)]" />
      <div className="relative">
        <SiteHeader dark />
        <div className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <Link href="/" className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-white/55 transition hover:text-white">
                <ArrowLeftIcon size={16} /> Back to product
              </Link>
              <h1 className="max-w-4xl text-4xl font-black leading-none tracking-tight md:text-6xl">Studio workspace</h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-white/62">
                Score the idea, generate six packaging angles, tune overlay text, and export a mobile-first YouTube thumbnail.
              </p>
            </div>
            <div className="flex max-w-sm items-start gap-3 rounded-3xl border border-white/10 bg-white/[0.05] p-4 text-sm leading-6 text-white/65">
              <ShieldIcon size={22} className="mt-0.5 shrink-0 text-[#facc15]" />
              We generate the visual concept first, then render editable overlay text separately so exports stay readable and brand-safe.
            </div>
          </div>
          <StudioWorkspace />
        </div>
        <SiteFooter dark />
      </div>
    </main>
  );
}
