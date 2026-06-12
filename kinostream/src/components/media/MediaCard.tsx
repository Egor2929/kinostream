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
    <Link href={href} className="group block w-full cursor-pointer focus-visible:rounded-xl outline-none">
      <article className="relative overflow-hidden rounded-xl border border-white/6 bg-surface transition-all duration-200 group-hover:-translate-y-1 group-hover:border-rose-600/30">
        <div className="relative aspect-[2/3] overflow-hidden">
          <Image
            src={imageUrl(item.poster_path, "w342")}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 16vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 transition-opacity duration-200 group-hover:opacity-100" />

          <div className="absolute inset-0 flex flex-col justify-end p-3.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <p className="mb-2 line-clamp-3 text-xs leading-relaxed text-slate-300">
              {item.overview || "Нет описания."}
            </p>
            <div className="flex items-center justify-between border-t border-white/10 pt-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                {mediaType === "tv" ? "Сериал" : "Фильм"}
              </span>
              {year && (
                <span className="text-[10px] font-semibold text-rose-400">{year}</span>
              )}
            </div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100 [@media(hover:none)]:opacity-100">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-600 text-white transition-transform duration-200 group-hover:scale-105">
              <Play className="h-5 w-5 fill-white pl-0.5" aria-hidden="true" />
            </div>
          </div>

          {item.vote_average > 0 && (
            <div className="absolute right-2 top-2 flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 text-[11px] font-semibold text-rose-400">
              <Star className="h-3 w-3 fill-current" aria-hidden="true" />
              <span>{formatRating(item.vote_average)}</span>
            </div>
          )}

          {mediaType === "tv" && (
            <span className="absolute left-2 top-2 rounded-md bg-rose-600 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
              TV
            </span>
          )}
        </div>

        <div className="border-t border-white/6 bg-surface-elevated/50 p-3.5">
          <h3
            className="line-clamp-2 h-10 overflow-hidden text-sm font-semibold leading-5 text-white transition-colors duration-200 group-hover:text-rose-400"
            title={item.title}
          >
            {item.title}
          </h3>
          <p className="mt-1 h-[0.875rem] shrink-0 text-[11px] leading-[0.875rem] text-slate-500">
            {year || "\u00A0"}
          </p>
        </div>
      </article>
    </Link>
  );
}
