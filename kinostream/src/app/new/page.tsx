import type { Metadata } from "next";
import { MediaGrid } from "@/components/media/MediaGrid";
import { PageHeader } from "@/components/ui/PageHeader";
import { getNowPlaying, getUpcoming } from "@/lib/tmdb";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Новинки кино",
  description:
    "Новинки кино и скоро в прокате на KinoRegin — свежие премьеры, актуальные релизы и анонсы.",
  path: "/new",
});

export default async function NewPage() {
  const [nowPlaying, upcoming] = await Promise.all([
    getNowPlaying(),
    getUpcoming(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <PageHeader
        badge="Премьеры"
        title="Новинки"
        subtitle="Свежие премьеры и скоро в прокате"
      />

      <section className="mt-10">
        <h2 className="mb-6 text-xl font-bold text-rose-400">
          Сейчас в кино
        </h2>
        <MediaGrid items={nowPlaying} type="movie" />
      </section>

      <section className="mt-14">
        <h2 className="mb-6 text-xl font-bold text-rose-400">
          Скоро
        </h2>
        <MediaGrid items={upcoming} type="movie" />
      </section>
    </div>
  );
}
