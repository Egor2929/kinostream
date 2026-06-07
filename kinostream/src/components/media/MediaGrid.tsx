import type { MediaItem, MediaType } from "@/types/media";
import { MediaCard } from "./MediaCard";

interface MediaGridProps {
  items: MediaItem[];
  type?: MediaType;
}

export function MediaGrid({ items, type }: MediaGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {items.map((item) => (
        <MediaCard key={item.id} item={item} type={type} />
      ))}
    </div>
  );
}
