import Link from "next/link";
import { Play } from "lucide-react";
import type { MediaType } from "@/types/media";

interface WatchButtonProps {
  id: number;
  type: MediaType;
  season?: number;
  episode?: number;
  className?: string;
  label?: string;
}

export function WatchButton({
  id,
  type,
  season = 1,
  episode = 1,
  className = "",
  label = "Смотреть бесплатно",
}: WatchButtonProps) {
  const href =
    type === "tv"
      ? `/watch/tv/${id}/${season}/${episode}`
      : `/watch/movie/${id}`;

  return (
    <Link
      href={href}
      className={`btn-glow inline-flex min-h-[48px] items-center gap-2 rounded-full bg-amber-500 px-6 py-3 text-sm font-bold text-black ${className}`}
    >
      <Play className="h-5 w-5 fill-black" />
      {label}
    </Link>
  );
}
