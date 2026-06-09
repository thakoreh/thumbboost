import { PlayCircleIcon } from "@/components/static-icons";
import type { Thumb } from "@/lib/thumbboost-content";

export function ThumbnailCard({
  thumb,
  overlay,
  watermark = false,
  compact = false,
}: {
  thumb: Thumb;
  overlay: string;
  watermark?: boolean;
  compact?: boolean;
}) {
  return (
    <div
      data-thumb-id={thumb.id}
      className="group relative aspect-video overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-black/25"
      style={{ background: `linear-gradient(135deg, ${thumb.palette[0]}, ${thumb.palette[1]})` }}
    >
      {thumb.imageUrl ? <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${thumb.imageUrl})` }} /> : null}
      <div className="absolute inset-0 opacity-45 thumb-grid" />
      <div
        className="absolute -right-10 -top-10 h-44 w-44 rounded-full blur-2xl transition-transform duration-500 group-hover:scale-125"
        style={{ background: thumb.palette[2] }}
      />
      <div className="absolute -bottom-16 left-6 h-48 w-48 rounded-full blur-3xl" style={{ background: thumb.palette[1] }} />
      <div className={`absolute rounded-full border border-white/25 bg-black/35 font-bold uppercase text-white backdrop-blur ${compact ? "left-4 top-4 px-2.5 py-1 text-[10px] tracking-[0.1em]" : "left-5 top-5 px-3 py-1 text-[11px] tracking-[0.14em]"}`}>
        {thumb.score}% signal
      </div>
      <div className={`absolute rotate-3 items-center justify-center bg-white text-zinc-950 shadow-xl ${compact ? "right-4 top-4 flex h-11 w-11 rounded-xl" : "right-5 top-5 flex h-14 w-14 rounded-2xl"}`}>
        <PlayCircleIcon size={compact ? 24 : 30} />
      </div>
      <div className={`absolute ${compact ? "inset-x-4 bottom-4" : "inset-x-5 bottom-5"}`}>
        {!compact ? (
          <div className="mb-3 inline-flex rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-zinc-950" style={{ background: thumb.palette[2] }}>
            {thumb.accent}
          </div>
        ) : null}
        <h3
          className={`max-w-[84%] text-balance font-black uppercase leading-[0.9] text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.75)] ${
            compact ? "text-lg md:text-xl" : "text-3xl md:text-4xl"
          }`}
        >
          {overlay || thumb.title}
        </h3>
        {!compact ? <p className="mt-2 max-w-[72%] text-sm font-semibold text-white/85">{thumb.subtitle}</p> : null}
      </div>
      {watermark && !compact ? (
        <div className="absolute bottom-4 right-4 rounded-full border border-white/25 bg-black/45 px-3 py-1 text-xs font-bold text-white/80 backdrop-blur">
          ThumbBoost free
        </div>
      ) : null}
    </div>
  );
}
