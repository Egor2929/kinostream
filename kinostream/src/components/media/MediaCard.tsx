import Image from "next/image";
import Link from "next/link";
import { Play, Star } from "lucide-react";
import type { MediaItem, MediaType } from "@/types/media";
import { formatRating, formatYear, imageUrl } from "@/lib/utils";

interface MediaCardProps {
  item: MediaItem;
  type?: MediaType;
}

export function MediaCard({ item, type }: MediaCardProps) {
  const mediaType = type ?? item.media_type ?? "movie";
  const href = mediaType === "tv" ? `/tv/${item.id}` : `/movie/${item.id}`;
  const year = formatYear(item.release_date ?? item.first_air_date);

  return (
    <Link href={href} className="group block focus-visible:rounded-2xl outline-none">
      <article className="relative overflow-hidden rounded-2xl bg-surface ring-1 ring-white/5 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-translate-y-2 group-hover:ring-amber-500/35 group-hover:shadow-[0_12px_28px_-4px_rgba(232,163,23,0.12)]">
        <div className="relative aspect-[2/3] overflow-hidden">
          <Image
            src={imageUrl(item.poster_path, "w342")}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 16vw"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-95" />

          {/* Frosted details panel on hover */}
          <div className="absolute inset-0 flex flex-col justify-end p-3.5 opacity-0 translate-y-3 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 group-hover:translate-y-0 z-10">
            <p className="line-clamp-3 text-xs leading-relaxed text-zinc-300 mb-1">
              {item.overview || "Нет описания."}
            </p>
            <div className="flex items-center justify-between border-t border-white/10 pt-2 mt-1">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                {mediaType === "tv" ? "Сериал" : "Фильм"}
              </span>
              {year && (
                <span className="text-[10px] font-bold text-amber-400">
                  {year}
                </span>
              )}
            </div>
          </div>

          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 scale-90 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:opacity-100 group-hover:scale-100">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500 text-black shadow-[0_4px_20px_rgba(232,163,23,0.4)] transition-transform duration-300 hover:scale-110 active:scale-95">
              <Play className="h-5 w-5 fill-black pl-0.5" aria-hidden="true" />
            </div>
          </div>

          {/* Rating tag */}
          {item.vote_average > 0 && (
            <div className="absolute right-2.5 top-2.5 flex items-center gap-1 rounded-lg bg-black/60 px-2 py-1 text-[11px] font-bold text-amber-400 ring-1 ring-white/10 backdrop-blur-md transition-all duration-300 group-hover:bg-amber-500 group-hover:text-black group-hover:ring-amber-500/20 shadow-sm">
              <Star className="h-3 w-3 fill-current" aria-hidden="true" />
              <span>{formatRating(item.vote_average)}</span>
            </div>
          )}

          {mediaType === "tv" && (
            <span className="absolute left-2.5 top-2.5 rounded-lg bg-amber-500 px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-black shadow-sm">
              TV
            </span>
          )}
        </div>

        <div className="border-t border-white/5 p-3.5 bg-surface-elevated">
          <h3 className="line-clamp-2 text-sm font-bold leading-snug text-white transition-colors duration-300 group-hover:text-amber-400">
            {item.title}
          </h3>
          {year && <p className="mt-1 text-[11px] font-semibold text-zinc-500">{year}</p>}
        </div>
      </article>
    </Link>
  );
}
