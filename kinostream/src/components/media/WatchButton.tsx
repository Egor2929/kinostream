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
    <Link href={href} className={`btn-cta min-h-[48px] px-6 py-3 text-sm ${className}`}>
      <Play className="h-5 w-5 fill-white" />
      {label}
    </Link>
  );
}
