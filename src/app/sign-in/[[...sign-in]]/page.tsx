import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { SparkleIcon } from "@/components/static-icons";

export default function SignInPage() {
  return (
    <div className="grid min-h-screen bg-[#f4f6f8] text-zinc-950 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="flex flex-col justify-between bg-[#111318] p-8 text-white lg:p-12">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#facc15] text-zinc-950">
            <SparkleIcon size={20} />
          </span>
          <span className="text-lg font-black tracking-tight">ThumbBoost</span>
        </Link>
        <div className="max-w-xl py-16">
          <h1 className="text-5xl font-black leading-none tracking-tight">Welcome back to your packaging workspace.</h1>
          <p className="mt-5 text-lg leading-8 text-white/65">Sign in to save generation history, compare older concepts, and keep your plan benefits active.</p>
        </div>
        <p className="text-sm text-white/45">YouTube packaging intelligence for creators and small channels.</p>
      </section>
      <section className="flex items-center justify-center p-6">
        <SignIn />
      </section>
    </div>
  );
}
