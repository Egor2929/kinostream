import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { WatchExperience } from "@/components/watch/WatchExperience";
import { resolveTrailer } from "@/lib/trailers";
import { getMovieDetails } from "@/lib/tmdb";
import { buildMetadata, movieDescription, tmdbImageUrl } from "@/lib/seo";
import { formatYear } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const movie = await getMovieDetails(Number(id));
    return buildMetadata({
      title: `Смотреть: ${movie.title}`,
      description: movieDescription(movie),
      path: `/watch/movie/${id}`,
      image: tmdbImageUrl(movie.backdrop_path ?? movie.poster_path, "w1280"),
      type: "video.movie",
      noIndex: true,
    });
  } catch {
    notFound();
  }
}

export default async function WatchMoviePage({ params }: PageProps) {
  const { id } = await params;
  const movieId = Number(id);
  if (Number.isNaN(movieId)) notFound();

  let movie;

  try {
    movie = await getMovieDetails(movieId);
  } catch {
    notFound();
  }

  const { trailer } = await resolveTrailer({
    tmdbId: movie.id,
    kind: "movie",
    title: movie.title,
    year: formatYear(movie.release_date) || undefined,
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <Link
        href={`/movie/${movie.id}`}
        className="mb-6 inline-flex cursor-pointer items-center gap-2 text-sm text-slate-400 transition-colors duration-200 hover:text-rose-400"
      >
        <ArrowLeft className="h-4 w-4" />
        Назад к фильму
      </Link>

      <h1 className="mb-6 text-2xl font-bold text-white sm:text-3xl">
        {movie.title}
      </h1>

      <WatchExperience
        title={movie.title}
        tmdbId={movie.id}
        kind="movie"
        trailer={trailer}
      />
    </div>
  );
}
