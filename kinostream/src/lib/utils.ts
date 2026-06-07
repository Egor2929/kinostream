export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function imageUrl(
  path: string | null | undefined,
  size: "w342" | "w500" | "w780" | "original" = "w500",
): string {
  if (!path) return "/placeholder-poster.svg";
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

export function formatRating(rating: number): string {
  return rating > 0 ? rating.toFixed(1) : "—";
}

export function formatYear(date?: string): string {
  if (!date) return "";
  return date.slice(0, 4);
}

export function formatRuntime(minutes: number | null): string {
  if (!minutes) return "";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}ч ${m}м` : `${m}м`;
}

export function getMediaTitle(item: {
  title?: string;
  name?: string;
}): string {
  return item.title ?? item.name ?? "Без названия";
}
