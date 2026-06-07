import Image from "next/image";
import Link from "next/link";
import { Info, Play, Star } from "lucide-react";
import type { MediaItem } from "@/types/media";
import { formatRating, formatYear, imageUrl } from "@/lib/utils";

interface HeroBannerProps {
  item: MediaItem;
}

export function HeroBanner({ item }: HeroBannerProps) {
  const mediaType = item.media_type ?? "movie";
  const watchHref =
    mediaType === "tv" ? `/watch/tv/${item.id}/1/1` : `/watch/movie/${item.id}`;
  const detailHref = mediaType === "tv" ? `/tv/${item.id}` : `/movie/${item.id}`;
  const year = formatYear(item.release_date ?? item.first_air_date);

  return (
    <section className="relative h-[80vh] min-h-[550px] w-full overflow-hidden">
      <Image
        src={imageUrl(item.backdrop_path, "original")}
        alt=""
        fill
        priority
        className="object-cover object-top animate-zoom-out"
        sizes="100vw"
        aria-hidden="true"
      />

      {/* Cinematic overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#030305] via-[#030305]/85 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/20 to-transparent" />
      <div className="hero-spotlight absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(232,163,23,0.1),transparent_60%)]" />

      {/* Letterbox feel */}
      <div className="absolute inset-x-0 top-0 h-1 bg-black/60" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#030305] to-transparent" />

      <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-24 pt-28 sm:px-6">
        <div className="max-w-2xl">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-amber-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
              В тренде
            </span>
            {year && (
              <span className="text-sm font-semibold text-zinc-400">{year}</span>
            )}
            {item.vote_average > 0 && (
              <span className="flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1 text-sm font-semibold text-amber-400 ring-1 ring-white/10 backdrop-blur-sm">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                {formatRating(item.vote_average)}
              </span>
            )}
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 ring-1 ring-emerald-500/20">
              Бесплатно
            </span>
          </div>

          <h1 className="font-display text-6xl font-extrabold tracking-tight leading-[0.9] text-white sm:text-7xl lg:text-8xl drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
            {item.title}
          </h1>

          <p className="mt-5 line-clamp-3 text-base leading-relaxed text-zinc-300 sm:text-lg drop-shadow-md">
            {item.overview}
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href={watchHref}
              className="btn-glow inline-flex min-h-[50px] items-center gap-2.5 rounded-full bg-amber-500 px-8 py-3.5 text-sm font-bold text-black shadow-lg shadow-amber-500/20"
            >
              <Play className="h-5 w-5 fill-black" />
              Смотреть бесплатно
            </Link>
            <Link
              href={detailHref}
              className="inline-flex min-h-[50px] items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-8 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:border-white/30 hover:bg-white/10 hover:scale-105 active:scale-95"
            >
              <Info className="h-4 w-4" />
              Подробнее
            </Link>
          </div>

          <p className="mt-6 flex items-center gap-2 text-xs text-zinc-500">
            <span className="h-px w-8 bg-zinc-800" />
            Короткая реклама перед просмотром · подписка не нужна
          </p>
        </div>
      </div>
    </section>
  );
}
