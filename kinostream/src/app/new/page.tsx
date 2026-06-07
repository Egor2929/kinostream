import type { Metadata } from "next";
import { MediaGrid } from "@/components/media/MediaGrid";
import { PageHeader } from "@/components/ui/PageHeader";
import { getNowPlaying, getUpcoming } from "@/lib/tmdb";

export const metadata: Metadata = {
  title: "Новинки",
};

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
        <h2 className="mb-6 font-display text-2xl font-bold text-amber-400">
          Сейчас в кино
        </h2>
        <MediaGrid items={nowPlaying} type="movie" />
      </section>

      <section className="mt-14">
        <h2 className="mb-6 font-display text-2xl font-bold text-amber-400">
          Скоро
        </h2>
        <MediaGrid items={upcoming} type="movie" />
      </section>
    </div>
  );
}
