import type { Metadata } from "next";
import type { MovieDetails, TVDetails } from "@/types/media";
import { formatYear } from "@/lib/utils";

export const SITE_NAME = "KinoRegin";
export const SITE_TAGLINE = "Бесплатный онлайн-кинотеатр";
export const DEFAULT_DESCRIPTION =
  "Смотрите фильмы и сериалы бесплатно на KinoRegin. Большой каталог, новинки кино и популярные сериалы — без подписки и регистрации.";
export const DEFAULT_KEYWORDS = [
  "фильмы онлайн",
  "сериалы онлайн",
  "смотреть бесплатно",
  "онлайн кинотеатр",
  "новинки кино",
  "KinoRegin",
];

export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kinoregin.ru";
  return url.replace(/\/$/, "");
}

export function truncate(text: string, max = 160): string {
  if (!text) return DEFAULT_DESCRIPTION;
  const trimmed = text.replace(/\s+/g, " ").trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 1).trim()}…`;
}

export function absoluteUrl(path = "/"): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${normalized === "/" ? "" : normalized}`.replace(
    /([^:]\/)\/+/g,
    "$1",
  ) || getSiteUrl();
}

export function tmdbImageUrl(
  path: string | null | undefined,
  size: "w780" | "w500" | "w1280" | "original" = "w780",
): string | undefined {
  if (!path) return undefined;
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

interface BuildMetadataOptions {
  title: string;
  description?: string;
  path?: string;
  image?: string | null;
  noIndex?: boolean;
  type?: "website" | "video.movie" | "video.tv_show";
}

export function buildMetadata({
  title,
  description,
  path = "/",
  image,
  noIndex = false,
  type = "website",
}: BuildMetadataOptions): Metadata {
  const desc = truncate(description ?? DEFAULT_DESCRIPTION);
  const url = absoluteUrl(path);
  const ogImage = image ?? absoluteUrl("/placeholder-poster.svg");
  const fullTitle = `${title} | ${SITE_NAME}`;

  return {
    title,
    description: desc,
    keywords: DEFAULT_KEYWORDS,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type,
      locale: "ru_RU",
      url,
      siteName: SITE_NAME,
      title: fullTitle,
      description: desc,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: true }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
  };
}

export function websiteJsonLd() {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: siteUrl,
    description: DEFAULT_DESCRIPTION,
    inLanguage: "ru-RU",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: getSiteUrl(),
    description: DEFAULT_DESCRIPTION,
    logo: absoluteUrl("/placeholder-poster.svg"),
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path?: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.path ? { item: absoluteUrl(item.path) } : {}),
    })),
  };
}

export function movieJsonLd(movie: MovieDetails) {
  const year = formatYear(movie.release_date);
  return {
    "@context": "https://schema.org",
    "@type": "Movie",
    name: movie.title,
    description: movie.overview || undefined,
    image: tmdbImageUrl(movie.poster_path ?? movie.backdrop_path),
    datePublished: movie.release_date || undefined,
    genre: movie.genres.map((g) => g.name),
    url: absoluteUrl(`/movie/${movie.id}`),
    ...(year ? { copyrightYear: year } : {}),
  };
}

export function tvSeriesJsonLd(show: TVDetails) {
  return {
    "@context": "https://schema.org",
    "@type": "TVSeries",
    name: show.title,
    description: show.overview || undefined,
    image: tmdbImageUrl(show.poster_path ?? show.backdrop_path),
    datePublished: show.first_air_date || undefined,
    genre: show.genres.map((g) => g.name),
    numberOfSeasons: show.number_of_seasons,
    numberOfEpisodes: show.number_of_episodes,
    url: absoluteUrl(`/tv/${show.id}`),
  };
}

export function movieDescription(movie: MovieDetails): string {
  const year = formatYear(movie.release_date);
  const prefix = year
    ? `${movie.title} (${year}) — смотреть онлайн бесплатно на KinoRegin.`
    : `${movie.title} — смотреть онлайн бесплатно на KinoRegin.`;
  return movie.overview ? `${prefix} ${movie.overview}` : prefix;
}

export function tvDescription(show: TVDetails): string {
  const year = formatYear(show.first_air_date);
  const prefix = year
    ? `${show.title} (${year}) — сериал онлайн бесплатно на KinoRegin.`
    : `${show.title} — сериал онлайн бесплатно на KinoRegin.`;
  return show.overview ? `${prefix} ${show.overview}` : prefix;
}
