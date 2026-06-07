import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  const pages = Math.min(totalPages, 20);
  const prev = currentPage > 1 ? currentPage - 1 : null;
  const next = currentPage < pages ? currentPage + 1 : null;

  return (
    <nav className="mt-10 flex items-center justify-center gap-2">
      {prev ? (
        <Link
          href={`${basePath}?page=${prev}`}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-zinc-400 transition hover:border-amber-400/50 hover:text-amber-400"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
      ) : (
        <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/5 text-zinc-700">
          <ChevronLeft className="h-4 w-4" />
        </span>
      )}

      <span className="px-4 text-sm text-zinc-400">
        Страница {currentPage} из {pages}
      </span>

      {next ? (
        <Link
          href={`${basePath}?page=${next}`}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-zinc-400 transition hover:border-amber-400/50 hover:text-amber-400"
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/5 text-zinc-700">
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}
