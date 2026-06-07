import type { Metadata } from "next";
import { MediaGrid } from "@/components/media/MediaGrid";
import { searchMulti } from "@/lib/tmdb";

export const metadata: Metadata = {
  title: "Поиск",
};

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const results = query ? await searchMulti(query) : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
        {query ? `Результаты: «${query}»` : "Поиск"}
      </h1>
      {query && (
        <p className="mt-2 text-zinc-500">
          Найдено: {results.length}{" "}
          {results.length === 1 ? "результат" : "результатов"}
        </p>
      )}
      {!query && (
        <p className="mt-2 text-zinc-500">
          Введите запрос в строке поиска выше
        </p>
      )}
      {results.length > 0 && (
        <div className="mt-8">
          <MediaGrid items={results} />
        </div>
      )}
      {query && results.length === 0 && (
        <p className="mt-12 text-center text-zinc-500">
          Ничего не найдено. Попробуйте другой запрос.
        </p>
      )}
    </div>
  );
}
