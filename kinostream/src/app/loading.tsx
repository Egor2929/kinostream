import { ContentRowSkeleton, HeroSkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Загрузка">
      <HeroSkeleton />
      <ContentRowSkeleton />
      <ContentRowSkeleton />
      <ContentRowSkeleton />
    </div>
  );
}
