import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Play, Star } from "lucide-react";
import { CastRow } from "@/components/media/CastRow";
import { ContentRow } from "@/components/media/ContentRow";
import { getSimilarTV, getTVCredits, getTVDetails } from "@/lib/tmdb";
import { formatRating, formatYear, imageUrl } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const show = await getTVDetails(Number(id));
    return { title: show.title, description: show.overview };
  } catch {
    return { title: "Сериал не найден" };
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
      <section className="relative">
        <div className="absolute inset-0 h-[50vh] min-h-[320px]">
          <Image
            src={imageUrl(show.backdrop_path, "original")}
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08080c] via-[#08080c]/70 to-[#08080c]/30" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-8 sm:px-6">
          <div className="flex flex-col gap-8 md:flex-row">
            <div className="relative mx-auto aspect-[2/3] w-48 shrink-0 overflow-hidden rounded-xl ring-2 ring-white/10 sm:w-56 md:mx-0">
              <Image
                src={imageUrl(show.poster_path, "w500")}
                alt={show.title}
                fill
                className="object-cover"
                sizes="224px"
              />
            </div>

            <div className="flex-1 pt-4 md:pt-16">
              <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">
                {show.title}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-zinc-400">
                {year && <span>{year}</span>}
                <span>
                  {show.number_of_seasons} сезон
                  {show.number_of_seasons > 1 ? "а" : ""} · {show.number_of_episodes} эп.
                </span>
                {show.vote_average > 0 && (
                  <span className="flex items-center gap-1 text-amber-400">
                    <Star className="h-4 w-4 fill-amber-400" />
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
                      className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:border-amber-400/50 hover:bg-amber-500/10"
                    >
                      <Play className="h-4 w-4 text-amber-400" />
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
