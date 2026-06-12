/**
 * Server-only trailer adapter for RU-friendly providers.
 *
 * YouTube is blocked in Russia — trailers are resolved from Kinopoisk,
 * Rutube, or VK (in that priority order). The client never talks to
 * these providers directly.
 */

import type { MediaType, Trailer, TrailerProvider, TrailerResult } from "@/types/media";

if (typeof window !== "undefined") {
  throw new Error("trailers adapter is server-only and must not run in the browser");
}

const RUTUBE_SEARCH = "https://rutube.ru/api/search/video/";
const KINOPOISK_API = "https://kinopoiskapiunofficial.tech";

const TRAILER_KEYWORDS =
  /(?:^|[\s(\[])(?:трейлер|trailer|тизер|teaser)(?:[\s)\]]|$)/i;
const BAD_KEYWORDS =
  /полный фильм|full movie|обзор|review|реклама|смотреть онлайн|фильм целиком|сезон \d+ серия/i;

const DEMO_TRAILER: Trailer = {
  provider: "rutube",
  title: "Демо-трейлер",
  embedUrl: "https://rutube.ru/play/embed/bb5b9f1822c44a630afa1acb766c6654?autoplay=1",
};

interface TrailerCandidate {
  provider: TrailerProvider;
  title: string;
  embedUrl: string;
  score: number;
}

function buildQuery(title: string, year?: string): string {
  return `${title}${year ? ` ${year}` : ""} трейлер`.trim();
}

function scoreTitle(title: string, durationSec: number, contentTitle: string): number {
  const lower = title.toLowerCase();
  const contentLower = contentTitle.toLowerCase();
  let score = 0;

  if (TRAILER_KEYWORDS.test(lower)) score += 20;
  if (durationSec >= 30 && durationSec <= 360) score += 10;
  if (durationSec > 900) score -= 30;
  if (durationSec > 0 && durationSec < 15) score -= 5;
  if (BAD_KEYWORDS.test(lower)) score -= 25;

  const words = contentLower.split(/\s+/).filter((w) => w.length > 2);
  score += words.filter((w) => lower.includes(w)).length * 3;

  return score;
}

function rutubeEmbed(id: string): string {
  return `https://rutube.ru/play/embed/${id}?autoplay=1`;
}

function vkEmbed(ownerId: number, videoId: number): string {
  return `https://vk.com/video_ext.php?oid=${ownerId}&id=${videoId}&hd=2&autoplay=1`;
}

function kinopoiskEmbed(filmId: number, trailerId: string): string {
  const params = new URLSearchParams({
    noAd: "1",
    autoplay: "1",
    onlyPlayer: "1",
  });
  return `https://widgets.kinopoisk.ru/discovery/film/${filmId}/trailer/${trailerId}?${params}`;
}

function pickBest(candidates: TrailerCandidate[]): Trailer | null {
  if (candidates.length === 0) return null;
  const best = candidates.reduce((a, b) => (b.score > a.score ? b : a));
  return best.score < 5 ? null : { provider: best.provider, title: best.title, embedUrl: best.embedUrl };
}

async function searchRutube(title: string, year?: string): Promise<Trailer | null> {
  const query = buildQuery(title, year);
  const url = `${RUTUBE_SEARCH}?query=${encodeURIComponent(query)}&page=1`;

  const res = await fetch(url, { next: { revalidate: 86400 } });
  if (!res.ok) return null;

  const data = (await res.json()) as {
    results?: Array<{ id: string; title: string; duration: number }>;
  };

  const candidates: TrailerCandidate[] = (data.results ?? []).map((item) => ({
    provider: "rutube",
    title: item.title,
    embedUrl: rutubeEmbed(item.id),
    score: scoreTitle(item.title, item.duration ?? 0, title),
  }));

  return pickBest(candidates);
}

async function searchVk(title: string, year?: string): Promise<Trailer | null> {
  const token = process.env.VK_ACCESS_TOKEN;
  if (!token) return null;

  const q = buildQuery(title, year);
  const url = new URL("https://api.vk.com/method/video.search");
  url.searchParams.set("q", q);
  url.searchParams.set("count", "20");
  url.searchParams.set("adult", "0");
  url.searchParams.set("access_token", token);
  url.searchParams.set("v", "5.199");

  const res = await fetch(url.toString(), { next: { revalidate: 86400 } });
  if (!res.ok) return null;

  const data = (await res.json()) as {
    response?: { items?: Array<{ owner_id: number; id: number; title: string; duration: number }> };
    error?: unknown;
  };
  if (data.error || !data.response?.items) return null;

  const candidates: TrailerCandidate[] = data.response.items.map((item) => ({
    provider: "vk",
    title: item.title,
    embedUrl: vkEmbed(item.owner_id, item.id),
    score: scoreTitle(item.title, item.duration ?? 0, title),
  }));

  return pickBest(candidates);
}

async function searchKinopoisk(title: string, year?: string): Promise<Trailer | null> {
  const apiKey = process.env.KINOPOISK_API_KEY;
  if (!apiKey) return null;

  const searchUrl = `${KINOPOISK_API}/api/v2.1/films/search-by-keyword?keyword=${encodeURIComponent(title)}`;
  const searchRes = await fetch(searchUrl, {
    headers: { "X-API-KEY": apiKey },
    next: { revalidate: 86400 },
  });
  if (!searchRes.ok) return null;

  const searchData = (await searchRes.json()) as {
    films?: Array<{ filmId: number; nameRu?: string; nameEn?: string; year?: string }>;
  };
  const films = searchData.films ?? [];
  if (films.length === 0) return null;

  const film =
    (year ? films.find((f) => f.year === year) : undefined) ??
    films.find(
      (f) =>
        f.nameRu?.toLowerCase().includes(title.toLowerCase()) ||
        f.nameEn?.toLowerCase().includes(title.toLowerCase()),
    ) ??
    films[0];

  const videosUrl = `${KINOPOISK_API}/api/v2.2/films/${film.filmId}/videos`;
  const videosRes = await fetch(videosUrl, {
    headers: { "X-API-KEY": apiKey },
    next: { revalidate: 86400 },
  });
  if (!videosRes.ok) return null;

  const videosData = (await videosRes.json()) as {
    items?: Array<{ name?: string; site?: string; url?: string; type?: string }>;
  };

  const trailer = (videosData.items ?? []).find(
    (v) =>
      v.type === "TRAILER" ||
      v.site === "KINOPOISK" ||
      /трейлер|trailer/i.test(v.name ?? ""),
  );
  if (!trailer?.url) return null;

  // Prefer widget embed with noAd when we can parse ids from the share URL.
  const idMatch = trailer.url.match(/film\/(\d+)\/trailer\/(\d+)/);
  const embedUrl = idMatch
    ? kinopoiskEmbed(Number(idMatch[1]), idMatch[2])
    : appendKinopoiskNoAd(trailer.url);

  return {
    provider: "kinopoisk",
    title: trailer.name ?? title,
    embedUrl,
  };
}

function appendKinopoiskNoAd(url: string): string {
  try {
    const parsed = new URL(url.startsWith("//") ? `https:${url}` : url);
    parsed.searchParams.set("noAd", "1");
    parsed.searchParams.set("autoplay", "1");
    parsed.searchParams.set("onlyPlayer", "1");
    return parsed.toString();
  } catch {
    return url;
  }
}

export async function resolveTrailer(params: {
  tmdbId: number;
  kind: MediaType;
  title: string;
  year?: string;
}): Promise<TrailerResult> {
  const base: TrailerResult = {
    tmdbId: params.tmdbId,
    kind: params.kind,
    trailer: null,
  };

  const providers: Array<() => Promise<Trailer | null>> = [
    () => searchKinopoisk(params.title, params.year),
    () => searchRutube(params.title, params.year),
    () => searchVk(params.title, params.year),
  ];

  for (const search of providers) {
    try {
      const trailer = await search();
      if (trailer) return { ...base, trailer };
    } catch {
      // try next provider
    }
  }

  return { ...base, trailer: DEMO_TRAILER };
}
