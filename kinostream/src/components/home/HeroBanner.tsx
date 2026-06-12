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
    <section className="relative h-[85vh] min-h-[560px] w-full overflow-hidden">
      <Image
        src={imageUrl(item.backdrop_path, "w1280")}
        alt=""
        fill
        priority
        className="object-cover object-center animate-zoom-out"
        sizes="100vw"
        aria-hidden="true"
      />

      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />

      <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-20 pt-28 sm:px-6">
        <div className="max-w-2xl">
          <div className="mb-5 flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-rose-600 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
              В тренде
            </span>
            {year && (
              <span className="text-sm font-medium text-slate-400">{year}</span>
            )}
            {item.vote_average > 0 && (
              <span className="flex items-center gap-1.5 rounded-md border border-white/10 bg-black/40 px-3 py-1 text-sm font-semibold text-rose-400">
                <Star className="h-4 w-4 fill-rose-500 text-rose-500" />
                {formatRating(item.vote_average)}
              </span>
            )}
            <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
              Бесплатно
            </span>
          </div>

          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            {item.title}
          </h1>

          <p className="mt-5 line-clamp-3 text-base leading-relaxed text-slate-300 sm:text-lg">
            {item.overview}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={watchHref}
              className="btn-cta min-h-[50px] px-8 py-3.5 text-sm"
            >
              <Play className="h-5 w-5 fill-white" />
              Смотреть бесплатно
            </Link>
            <Link href={detailHref} className="btn-ghost min-h-[50px] px-8 py-3.5 text-sm">
              <Info className="h-4 w-4" />
              Подробнее
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
