import type { Metadata } from "next";
import { MediaGrid } from "@/components/media/MediaGrid";
import { PageHeader } from "@/components/ui/PageHeader";
import { Pagination } from "@/components/ui/Pagination";
import { discoverMovies } from "@/lib/tmdb";

export const metadata: Metadata = {
  title: "Фильмы",
};

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function MoviesPage({ searchParams }: PageProps) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const { items, totalPages } = await discoverMovies(page);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <PageHeader
        badge="Каталог"
        title="Все фильмы"
        subtitle="Тысячи фильмов — бесплатно, с рекламой перед просмотром"
      />
      <div>
        <MediaGrid items={items} type="movie" />
      </div>
      <Pagination currentPage={page} totalPages={totalPages} basePath="/movies" />
    </div>
  );
}
