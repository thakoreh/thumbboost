import Link from "next/link";

export function SiteFooter({ dark = false }: { dark?: boolean }) {
  return (
    <footer className={dark ? "border-t border-white/10 bg-[#0d0f14] text-white/55" : "border-t border-zinc-200 bg-white text-zinc-500"}>
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-4 py-8 text-sm sm:flex-row sm:px-6 lg:px-8">
        <p>ThumbBoost. YouTube packaging intelligence for creators and small channels.</p>
        <div className="flex flex-wrap gap-5 font-semibold">
          <Link href="/studio" className={dark ? "hover:text-white" : "hover:text-zinc-950"}>
            Studio
          </Link>
          <Link href="/examples" className={dark ? "hover:text-white" : "hover:text-zinc-950"}>
            Examples
          </Link>
          <Link href="/pricing" className={dark ? "hover:text-white" : "hover:text-zinc-950"}>
            Pricing
          </Link>
          <Link href="/privacy" className={dark ? "hover:text-white" : "hover:text-zinc-950"}>
            Privacy
          </Link>
          <Link href="/terms" className={dark ? "hover:text-white" : "hover:text-zinc-950"}>
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
