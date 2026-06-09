import Link from "next/link";
import { SparkleIcon } from "@/components/static-icons";

const navItems = [
  { href: "/studio", label: "Studio" },
  { href: "/examples", label: "Examples" },
  { href: "/pricing", label: "Pricing" },
];

export function SiteHeader({ dark = false }: { dark?: boolean }) {
  return (
    <header className="relative z-20">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <Link href="/" className={`flex items-center gap-3 ${dark ? "text-white" : "text-zinc-950"}`}>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#facc15] text-zinc-950">
            <SparkleIcon size={20} />
          </span>
          <span className="text-lg font-black tracking-tight">ThumbBoost</span>
        </Link>
        <nav className={`hidden items-center gap-7 text-sm font-bold md:flex ${dark ? "text-white/70" : "text-zinc-600"}`}>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={dark ? "transition hover:text-white" : "transition hover:text-zinc-950"}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/sign-in"
            className={`hidden rounded-full border px-4 py-2 text-sm font-bold transition sm:inline-flex ${
              dark ? "border-white/15 text-white/75 hover:bg-white/10 hover:text-white" : "border-zinc-200 text-zinc-700 hover:border-zinc-300 hover:bg-white"
            }`}
          >
            Sign in
          </Link>
          <Link href="/studio" className="rounded-full bg-[#facc15] px-4 py-2 text-sm font-black text-zinc-950 transition hover:-translate-y-0.5 active:scale-[0.98]">
            Open studio
          </Link>
        </div>
      </div>
    </header>
  );
}
