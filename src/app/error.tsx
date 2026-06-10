"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArrowRightIcon, SparkleIcon } from "@/components/static-icons";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("app_error_boundary", error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#111318] px-4 py-16 text-white">
      <section className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 shadow-2xl">
        <div className="mb-8 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#facc15] text-zinc-950">
            <SparkleIcon size={20} />
          </span>
          <span className="text-lg font-black tracking-tight">ThumbBoost</span>
        </div>
        <p className="text-sm font-black uppercase tracking-[0.16em] text-[#facc15]">Workspace interrupted</p>
        <h1 className="mt-3 text-5xl font-black leading-none tracking-tight">Something broke before the package was ready.</h1>
        <p className="mt-5 max-w-xl leading-7 text-white/65">
          Retry the current view, or return to the studio with your video idea. The issue has been logged in the browser console for debugging.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button onClick={reset} className="rounded-full bg-[#facc15] px-5 py-3 font-black text-zinc-950 transition active:scale-[0.98]">
            Try again
          </button>
          <Link href="/studio" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 font-black text-white/80 transition hover:bg-white/10">
            Open studio <ArrowRightIcon size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
