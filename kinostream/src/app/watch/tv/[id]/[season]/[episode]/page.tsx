import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { WatchExperience } from "@/components/watch/WatchExperience";
import { resolveTrailer } from "@/lib/trailers";
import { getTVDetails } from "@/lib/tmdb";
import { buildMetadata, tmdbImageUrl, tvDescription } from "@/lib/seo";
import { formatYear } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string; season: string; episode: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id, season, episode } = await params;
  try {
    const show = await getTVDetails(Number(id));
    return buildMetadata({
      title: `Смотреть: ${show.title} S${season}E${episode}`,
      description: tvDescription(show),
      path: `/watch/tv/${id}/${season}/${episode}`,
      image: tmdbImageUrl(show.backdrop_path ?? show.poster_path, "w1280"),
      type: "video.tv_show",
      noIndex: true,
    });
  } catch {
    notFound();
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

  try {
    show = await getTVDetails(tvId);
  } catch {
    notFound();
  }

  const title = `${show.title} — S${seasonNum}:E${episodeNum}`;
  const { trailer } = await resolveTrailer({
    tmdbId: show.id,
    kind: "tv",
    title: show.title,
    year: formatYear(show.first_air_date) || undefined,
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <Link
        href={`/tv/${show.id}`}
        className="mb-6 inline-flex cursor-pointer items-center gap-2 text-sm text-slate-400 transition-colors duration-200 hover:text-rose-400"
      >
        <ArrowLeft className="h-4 w-4" />
        Назад к сериалу
      </Link>

      <h1 className="mb-2 text-2xl font-bold text-white sm:text-3xl">
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
        trailer={trailer}
      />

      {show.seasons.length > 0 && (
        <nav className="mt-8 flex flex-wrap gap-2">
          {show.seasons.map((s) => (
            <Link
              key={s.id}
              href={`/watch/tv/${show.id}/${s.season_number}/1`}
              className={`cursor-pointer rounded-lg px-3 py-1.5 text-sm transition-colors duration-200 ${
                s.season_number === seasonNum
                  ? "bg-rose-600 font-medium text-white"
                  : "border border-white/8 text-slate-400 hover:border-rose-600/40"
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
