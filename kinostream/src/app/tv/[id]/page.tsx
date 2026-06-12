import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Play, Star } from "lucide-react";
import { CastRow } from "@/components/media/CastRow";
import { ContentRow } from "@/components/media/ContentRow";
import { JsonLd } from "@/components/seo/JsonLd";
import { getSimilarTV, getTVCredits, getTVDetails } from "@/lib/tmdb";
import {
  breadcrumbJsonLd,
  buildMetadata,
  tmdbImageUrl,
  tvDescription,
  tvSeriesJsonLd,
} from "@/lib/seo";
import { formatRating, formatYear, imageUrl } from "@/lib/utils";

export const revalidate = 86400;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const show = await getTVDetails(Number(id));
    return buildMetadata({
      title: show.title,
      description: tvDescription(show),
      path: `/tv/${id}`,
      image: tmdbImageUrl(show.backdrop_path ?? show.poster_path, "w1280"),
      type: "video.tv_show",
    });
  } catch {
    notFound();
  }
}

export default async function TVPage({ params }: PageProps) {
  const { id } = await params;
  const tvId = Number(id);
  if (Number.isNaN(tvId)) notFound();

  let show;
  let cast;
  let similar;

  try {
    [show, cast, similar] = await Promise.all([
      getTVDetails(tvId),
      getTVCredits(tvId),
      getSimilarTV(tvId),
    ]);
  } catch {
    notFound();
  }

  const year = formatYear(show.first_air_date);
  const genres = show.genres.map((g) => g.name).join(" · ");

  return (
    <>
      <JsonLd
        data={[
          tvSeriesJsonLd(show),
          breadcrumbJsonLd([
            { name: "Главная", path: "/" },
            { name: "Сериалы", path: "/series" },
            { name: show.title },
          ]),
        ]}
      />
      <section className="relative">
        <div className="absolute inset-0 h-[50vh] min-h-[320px]">
          <Image
            src={imageUrl(show.backdrop_path, "w1280")}
            alt={`${show.title} — фон`}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-8 sm:px-6">
          <div className="flex flex-col gap-8 md:flex-row">
            <div className="relative mx-auto aspect-[2/3] w-48 shrink-0 overflow-hidden rounded-xl border border-white/8 sm:w-56 md:mx-0">
              <Image
                src={imageUrl(show.poster_path, "w500")}
                alt={show.title}
                fill
                className="object-cover"
                sizes="224px"
              />
            </div>

            <div className="flex-1 pt-4 md:pt-16">
              <h1 className="text-3xl font-bold text-white sm:text-4xl">
                {show.title}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-zinc-400">
                {year && <span>{year}</span>}
                <span>
                  {show.number_of_seasons} сезон
                  {show.number_of_seasons > 1 ? "а" : ""} · {show.number_of_episodes} эп.
                </span>
                {show.vote_average > 0 && (
                  <span className="flex items-center gap-1 text-rose-400">
                    <Star className="h-4 w-4 fill-rose-500" />
                    {formatRating(show.vote_average)}
                  </span>
                )}
                {genres && <span>{genres}</span>}
              </div>
              <p className="mt-6 max-w-2xl leading-relaxed text-zinc-300">
                {show.overview}
              </p>

              <section className="mt-8">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500">
                  Сезоны
                </h2>
                <div className="flex flex-wrap gap-3">
                  {show.seasons.map((season) => (
                    <Link
                      key={season.id}
                      href={`/watch/tv/${show.id}/${season.season_number}/1`}
                      className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/8 bg-white/5 px-4 py-2 text-sm text-white transition-colors duration-200 hover:border-rose-600/40 hover:bg-rose-600/10"
                    >
                      <Play className="h-4 w-4 text-rose-500" />
                      {season.name}
                      <span className="text-zinc-500">({season.episode_count} эп.)</span>
                    </Link>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <CastRow cast={cast} />
        <ContentRow title="Похожие сериалы" items={similar} type="tv" />
      </div>
    </>
  );
}
