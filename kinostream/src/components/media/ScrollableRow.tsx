"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { MediaItem, MediaType } from "@/types/media";
import { MediaCard } from "./MediaCard";

interface ScrollableRowProps {
  items: MediaItem[];
  type?: MediaType;
}

export function ScrollableRow({ items, type }: ScrollableRowProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const updateArrows = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows, items]);

  function scroll(dir: "left" | "right") {
    ref.current?.scrollBy({
      left: dir === "left" ? -400 : 400,
      behavior: "smooth",
    });
  }

  return (
    <div className="group/row relative">
      {canLeft && (
        <button
          type="button"
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-white/10 bg-black/80 p-2.5 text-white opacity-0 shadow-xl backdrop-blur-sm transition hover:border-amber-400/50 hover:text-amber-400 group-hover/row:opacity-100 md:flex"
          aria-label="Прокрутить влево"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}
      {canRight && (
        <button
          type="button"
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-white/10 bg-black/80 p-2.5 text-white opacity-0 shadow-xl backdrop-blur-sm transition hover:border-amber-400/50 hover:text-amber-400 group-hover/row:opacity-100 md:flex"
          aria-label="Прокрутить вправо"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}

      <div
        ref={ref}
        className="scrollbar-hide flex gap-4 overflow-x-auto px-4 pb-2 scroll-smooth sm:px-6"
      >
        {items.map((item, i) => (
          <div
            key={item.id}
            className="w-36 shrink-0 animate-fade-up sm:w-40 md:w-44"
            style={{ animationDelay: `${Math.min(i * 40, 400)}ms` }}
          >
            <MediaCard item={item} type={type} />
          </div>
        ))}
      </div>
    </div>
  );
}
