import type { Metadata } from "next";

import { MediaGrid } from "@/components/media/MediaGrid";

import { PageHeader } from "@/components/ui/PageHeader";

import { Pagination } from "@/components/ui/Pagination";

import { discoverTV } from "@/lib/tmdb";

import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;



interface PageProps {

  searchParams: Promise<{ page?: string }>;

}



export async function generateMetadata({

  searchParams,

}: PageProps): Promise<Metadata> {

  const { page: pageParam } = await searchParams;

  const page = Math.max(1, Number(pageParam) || 1);

  const path = page > 1 ? `/series?page=${page}` : "/series";



  return buildMetadata({

    title: page > 1 ? `Сериалы — страница ${page}` : "Сериалы онлайн",

    description:

      "Каталог сериалов на KinoRegin: популярные шоу, новые сезоны и мировые хиты — бесплатно и без регистрации.",

    path,

  });

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

