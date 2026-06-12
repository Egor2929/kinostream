import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import { CastRow } from "@/components/media/CastRow";
import { ContentRow } from "@/components/media/ContentRow";
import { WatchButton } from "@/components/media/WatchButton";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  getMovieCredits,
  getMovieDetails,
  getSimilarMovies,
} from "@/lib/tmdb";
import {
  breadcrumbJsonLd,
  buildMetadata,
  movieDescription,
  movieJsonLd,
  tmdbImageUrl,
} from "@/lib/seo";
import { formatRating, formatRuntime, formatYear, imageUrl } from "@/lib/utils";

export const revalidate = 86400;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const movie = await getMovieDetails(Number(id));
    return buildMetadata({
      title: movie.title,
      description: movieDescription(movie),
      path: `/movie/${id}`,
      image: tmdbImageUrl(movie.backdrop_path ?? movie.poster_path, "w1280"),
      type: "video.movie",
    });
  } catch {
    notFound();
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
      <JsonLd
        data={[
          movieJsonLd(movie),
          breadcrumbJsonLd([
            { name: "Главная", path: "/" },
            { name: "Фильмы", path: "/movies" },
            { name: movie.title },
          ]),
        ]}
      />
      <section className="relative">
        <div className="absolute inset-0 h-[50vh] min-h-[320px]">
          <Image
            src={imageUrl(movie.backdrop_path, "w1280")}
            alt={`${movie.title} — фон`}
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
                src={imageUrl(movie.poster_path, "w500")}
                alt={movie.title}
                fill
                className="object-cover"
                sizes="224px"
              />
            </div>

            <div className="flex-1 pt-4 md:pt-16">
              <h1 className="text-3xl font-bold text-white sm:text-4xl">
                {movie.title}
              </h1>
              {movie.tagline && (
                <p className="mt-2 text-lg italic text-zinc-400">{movie.tagline}</p>
              )}
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-zinc-400">
                {year && <span>{year}</span>}
                {movie.runtime && <span>{formatRuntime(movie.runtime)}</span>}
                {movie.vote_average > 0 && (
                  <span className="flex items-center gap-1 text-rose-400">
                    <Star className="h-4 w-4 fill-rose-500" />
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
