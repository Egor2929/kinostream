import type { Metadata } from "next";
import { MediaGrid } from "@/components/media/MediaGrid";
import { PageHeader } from "@/components/ui/PageHeader";
import { Pagination } from "@/components/ui/Pagination";
import { discoverTV } from "@/lib/tmdb";

export const metadata: Metadata = {
  title: "Сериалы",
};

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function SeriesPage({ searchParams }: PageProps) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const { items, totalPages } = await discoverTV(page);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <PageHeader
        badge="Каталог"
        title="Все сериалы"
        subtitle="Сериалы со всего мира — смотрите бесплатно"
      />
      <div>
        <MediaGrid items={items} type="tv" />
      </div>
      <Pagination currentPage={page} totalPages={totalPages} basePath="/series" />
    </div>
  );
}
