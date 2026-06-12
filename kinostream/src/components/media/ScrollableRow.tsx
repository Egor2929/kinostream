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

  const arrowClass =
    "absolute top-1/2 z-20 hidden -translate-y-1/2 cursor-pointer rounded-lg border border-white/8 bg-black/90 p-2.5 text-white opacity-70 transition-all duration-200 hover:border-rose-600/40 hover:text-rose-400 hover:opacity-100 group-hover/row:opacity-100 md:flex";

  return (
    <div className="group/row relative">
      {canLeft && (
        <>
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-black to-transparent"
            aria-hidden="true"
          />
          <button
            type="button"
            onClick={() => scroll("left")}
            className={`left-0 ${arrowClass}`}
            aria-label="Прокрутить влево"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </>
      )}
      {canRight && (
        <>
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-black to-transparent"
            aria-hidden="true"
          />
          <button
            type="button"
            onClick={() => scroll("right")}
            className={`right-0 ${arrowClass}`}
            aria-label="Прокрутить вправо"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      <div
        ref={ref}
        className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 scroll-smooth sm:px-6"
      >
        {items.map((item, i) => (
          <div
            key={item.id}
            className="w-36 shrink-0 snap-start animate-fade-up sm:w-40 md:w-44"
            style={{ animationDelay: `${Math.min(i * 30, 300)}ms` }}
          >
            <MediaCard item={item} type={type} />
          </div>
        ))}
      </div>
    </div>
  );
}
