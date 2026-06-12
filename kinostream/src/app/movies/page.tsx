import type { Metadata } from "next";

import { MediaGrid } from "@/components/media/MediaGrid";

import { PageHeader } from "@/components/ui/PageHeader";

import { Pagination } from "@/components/ui/Pagination";

import { discoverMovies } from "@/lib/tmdb";

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

  const path = page > 1 ? `/movies?page=${page}` : "/movies";



  return buildMetadata({

    title: page > 1 ? `Фильмы — страница ${page}` : "Фильмы онлайн",

    description:

      "Каталог фильмов на KinoRegin: популярное, новинки и классика — смотрите бесплатно без регистрации.",

    path,

  });

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

        subtitle="Тысячи фильмов — смотрите бесплатно"

      />

      <div>

        <MediaGrid items={items} type="movie" />

      </div>

      <Pagination currentPage={page} totalPages={totalPages} basePath="/movies" />

    </div>

  );

}

