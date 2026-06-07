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
      className="animate-fade-up py-7"
      style={{ animationDelay: `${index * 80}ms` }}
      aria-labelledby={`row-${title.replace(/\s/g, "-")}`}
    >
      <div className="mb-5 flex items-end justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1 rounded-full bg-amber-500" aria-hidden="true" />
          <h2
            id={`row-${title.replace(/\s/g, "-")}`}
            className="font-display text-2xl tracking-wide text-white sm:text-3xl"
          >
            {title}
          </h2>
        </div>
        {href && (
          <Link
            href={href}
            className="flex items-center gap-1 rounded-full border border-white/10 px-3 py-1.5 text-sm text-amber-400 transition hover:border-amber-400/40 hover:bg-amber-400/5"
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
