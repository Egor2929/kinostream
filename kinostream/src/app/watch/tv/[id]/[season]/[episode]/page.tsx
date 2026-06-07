import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { WatchExperience } from "@/components/watch/WatchExperience";
import { getTVDetails, getTVVideos, pickBestVideo } from "@/lib/tmdb";

interface PageProps {
  params: Promise<{ id: string; season: string; episode: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id, season, episode } = await params;
  try {
    const show = await getTVDetails(Number(id));
    return {
      title: `Смотреть: ${show.title} S${season}E${episode}`,
    };
  } catch {
    return { title: "Просмотр" };
  }
}

export default async function WatchTVPage({ params }: PageProps) {
  const { id, season, episode } = await params;
  const tvId = Number(id);
  const seasonNum = Number(season);
  const episodeNum = Number(episode);

  if (Number.isNaN(tvId) || Number.isNaN(seasonNum) || Number.isNaN(episodeNum)) {
    notFound();
  }

  let show;
  let videos;

  try {
    [show, videos] = await Promise.all([
      getTVDetails(tvId),
      getTVVideos(tvId),
    ]);
  } catch {
    notFound();
  }

  const video = pickBestVideo(videos);
  const title = `${show.title} — S${seasonNum}:E${episodeNum}`;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <Link
        href={`/tv/${show.id}`}
        className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-amber-400"
      >
        <ArrowLeft className="h-4 w-4" />
        Назад к сериалу
      </Link>

      <h1 className="mb-2 font-display text-2xl font-bold text-white sm:text-3xl">
        {show.title}
      </h1>
      <p className="mb-6 text-zinc-500">
        Сезон {seasonNum} · Эпизод {episodeNum}
      </p>

      <WatchExperience
        title={title}
        tmdbId={show.id}
        kind="tv"
        season={seasonNum}
        episode={episodeNum}
        youtubeKey={video?.key ?? null}
      />

      {show.seasons.length > 0 && (
        <nav className="mt-8 flex flex-wrap gap-2">
          {show.seasons.map((s) => (
            <Link
              key={s.id}
              href={`/watch/tv/${show.id}/${s.season_number}/1`}
              className={`rounded-lg px-3 py-1.5 text-sm transition ${
                s.season_number === seasonNum
                  ? "bg-amber-500 text-black font-medium"
                  : "border border-white/10 text-zinc-400 hover:border-amber-400/50"
              }`}
            >
              {s.name}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
