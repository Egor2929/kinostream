import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn("skeleton rounded-lg", className)} aria-hidden="true" />;
}

export function MediaCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="aspect-[2/3] w-full rounded-xl" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/3" />
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative h-[70vh] min-h-[480px] w-full overflow-hidden bg-surface">
      <div className="absolute inset-0 skeleton opacity-30" />
      <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-16 pt-24 sm:px-6">
        <Skeleton className="mb-3 h-6 w-24 rounded-full" />
        <Skeleton className="h-14 w-full max-w-lg" />
        <Skeleton className="mt-4 h-16 w-full max-w-xl" />
        <div className="mt-8 flex gap-3">
          <Skeleton className="h-12 w-44 rounded-full" />
          <Skeleton className="h-12 w-32 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function MediaGridSkeleton({ count = 18 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {Array.from({ length: count }).map((_, i) => (
        <MediaCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ContentRowSkeleton() {
  return (
    <section className="py-6 px-4 sm:px-6">
      <Skeleton className="mb-4 h-8 w-48" />
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="w-36 shrink-0 sm:w-40">
            <MediaCardSkeleton />
          </div>
        ))}
      </div>
    </section>
  );
}
