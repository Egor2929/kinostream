import { MediaGridSkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6" aria-busy="true" aria-label="Загрузка">
      <div className="mb-10 h-40 rounded-xl border border-white/8 bg-surface" />
      <MediaGridSkeleton />
    </div>
  );
}
