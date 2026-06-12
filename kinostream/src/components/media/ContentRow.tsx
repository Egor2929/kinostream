import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { MediaItem, MediaType } from "@/types/media";
import { ScrollableRow } from "./ScrollableRow";

interface ContentRowProps {
  title: string;
  items: MediaItem[];
  href?: string;
  type?: MediaType;
  index?: number;
}

export function ContentRow({ title, items, href, type, index = 0 }: ContentRowProps) {
  if (items.length === 0) return null;

  return (
    <section
      className="animate-fade-up py-8"
      style={{ animationDelay: `${index * 60}ms` }}
      aria-labelledby={`row-${title.replace(/\s/g, "-")}`}
    >
      <div className="mb-5 flex items-end justify-between px-4 sm:px-6">
        <h2
          id={`row-${title.replace(/\s/g, "-")}`}
          className="text-xl font-bold text-white sm:text-2xl"
        >
          {title}
        </h2>
        {href && (
          <Link
            href={href}
            className="flex cursor-pointer items-center gap-1 rounded-lg border border-white/8 px-3 py-1.5 text-sm text-rose-400 transition-colors duration-200 hover:border-rose-600/40 hover:bg-rose-600/5"
          >
            Все
            <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>
      <ScrollableRow items={items} type={type} />
    </section>
  );
}
