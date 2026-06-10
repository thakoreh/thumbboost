import Link from "next/link";
import { ArrowRightIcon, SparkleIcon } from "@/components/static-icons";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4f6f8] px-4 py-16 text-zinc-950">
      <section className="w-full max-w-2xl rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="mb-8 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#facc15] text-zinc-950">
            <SparkleIcon size={20} />
          </span>
          <span className="text-lg font-black tracking-tight">ThumbBoost</span>
        </div>
        <p className="text-sm font-black uppercase tracking-[0.16em] text-zinc-500">404</p>
        <h1 className="mt-3 text-5xl font-black leading-none tracking-tight">That packaging route does not exist.</h1>
        <p className="mt-5 max-w-xl leading-7 text-zinc-600">
          Head back to the studio, pricing, or examples page to keep working on your next YouTube thumbnail decision.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/studio" className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-5 py-3 font-black text-white transition active:scale-[0.98]">
            Open studio <ArrowRightIcon size={18} />
          </Link>
          <Link href="/" className="rounded-full border border-zinc-200 px-5 py-3 font-black text-zinc-700 transition hover:bg-zinc-50">
            Back home
          </Link>
        </div>
      </section>
    </main>
  );
}
