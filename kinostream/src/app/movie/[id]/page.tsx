import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import { CastRow } from "@/components/media/CastRow";
import { ContentRow } from "@/components/media/ContentRow";
import { WatchButton } from "@/components/media/WatchButton";
import {
  getMovieCredits,
  getMovieDetails,
  getSimilarMovies,
} from "@/lib/tmdb";
import { formatRating, formatRuntime, formatYear, imageUrl } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const movie = await getMovieDetails(Number(id));
    return { title: movie.title, description: movie.overview };
  } catch {
    return { title: "Фильм не найден" };
  }
}

export default async function MoviePage({ params }: PageProps) {
  const { id } = await params;
  const movieId = Number(id);
  if (Number.isNaN(movieId)) notFound();

  let movie;
  let cast;
  let similar;

  try {
    [movie, cast, similar] = await Promise.all([
      getMovieDetails(movieId),
      getMovieCredits(movieId),
      getSimilarMovies(movieId),
    ]);
  } catch {
    notFound();
  }

  const year = formatYear(movie.release_date);
  const genres = movie.genres.map((g) => g.name).join(" · ");

  return (
    <>
      <section className="relative">
        <div className="absolute inset-0 h-[50vh] min-h-[320px]">
          <Image
            src={imageUrl(movie.backdrop_path, "original")}
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
                src={imageUrl(movie.poster_path, "w500")}
                alt={movie.title}
                fill
                className="object-cover"
                sizes="224px"
              />
            </div>

            <div className="flex-1 pt-4 md:pt-16">
              <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">
                {movie.title}
              </h1>
              {movie.tagline && (
                <p className="mt-2 text-lg italic text-zinc-400">{movie.tagline}</p>
              )}
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-zinc-400">
                {year && <span>{year}</span>}
                {movie.runtime && <span>{formatRuntime(movie.runtime)}</span>}
                {movie.vote_average > 0 && (
                  <span className="flex items-center gap-1 text-amber-400">
                    <Star className="h-4 w-4 fill-amber-400" />
                    {formatRating(movie.vote_average)}
                  </span>
                )}
                {genres && <span>{genres}</span>}
              </div>
              <p className="mt-6 max-w-2xl leading-relaxed text-zinc-300">
                {movie.overview}
              </p>
              <div className="mt-8">
                <WatchButton id={movie.id} type="movie" />
              </div>
              <p className="mt-3 text-xs text-zinc-500">
                Бесплатно · перед просмотром — реклама ~15 сек
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <CastRow cast={cast} />
        <ContentRow title="Похожие фильмы" items={similar} type="movie" />
      </div>
    </>
  );
}
