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

  const btnClass =
    "flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg border border-white/8 text-slate-400 transition-colors duration-200 hover:border-rose-600/40 hover:text-rose-400";
  const disabledClass =
    "flex h-11 w-11 items-center justify-center rounded-lg border border-white/5 text-slate-700";

  return (
    <nav className="mt-10 flex items-center justify-center gap-2">
      {prev ? (
        <Link href={`${basePath}?page=${prev}`} className={btnClass}>
          <ChevronLeft className="h-4 w-4" />
        </Link>
      ) : (
        <span className={disabledClass}>
          <ChevronLeft className="h-4 w-4" />
        </span>
      )}

      <span className="px-4 text-sm text-slate-400">
        Страница {currentPage} из {pages}
      </span>

      {next ? (
        <Link href={`${basePath}?page=${next}`} className={btnClass}>
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className={disabledClass}>
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}
