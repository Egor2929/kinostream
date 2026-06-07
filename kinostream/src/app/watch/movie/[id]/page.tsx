import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { WatchExperience } from "@/components/watch/WatchExperience";
import {
  getMovieDetails,
  getMovieVideos,
  pickBestVideo,
} from "@/lib/tmdb";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const movie = await getMovieDetails(Number(id));
    return { title: `Смотреть: ${movie.title}` };
  } catch {
    return { title: "Просмотр" };
  }
}

export default async function WatchMoviePage({ params }: PageProps) {
  const { id } = await params;
  const movieId = Number(id);
  if (Number.isNaN(movieId)) notFound();

  let movie;
  let videos;

  try {
    [movie, videos] = await Promise.all([
      getMovieDetails(movieId),
      getMovieVideos(movieId),
    ]);
  } catch {
    notFound();
  }

  const video = pickBestVideo(videos);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <Link
        href={`/movie/${movie.id}`}
        className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-amber-400"
      >
        <ArrowLeft className="h-4 w-4" />
        Назад к фильму
      </Link>

      <h1 className="mb-6 font-display text-2xl font-bold text-white sm:text-3xl">
        {movie.title}
      </h1>

      <WatchExperience
        title={movie.title}
        tmdbId={movie.id}
        kind="movie"
        youtubeKey={video?.key ?? null}
      />
    </div>
  );
}
