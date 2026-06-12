/**
 * Server-only Kodik adapter.
 *
 * The client must NEVER import this module or call Kodik directly.
 * Access goes exclusively through the playback proxy route (`/api/playback`),
 * which returns the normalized `PlaybackResult` contract.
 */

import type {
  MediaType,
  PlaybackResult,
  PlaybackStream,
  Translation,
} from "@/types/media";

if (typeof window !== "undefined") {
  throw new Error("kodik adapter is server-only and must not run in the browser");
}

const KODIK_BASE = process.env.KODIK_API_BASE ?? "https://kodikapi.com";

/** Demo mode mirrors tmdb.ts behavior: work without secrets, return mock data. */
export const KODIK_DEMO_MODE = !process.env.KODIK_TOKEN;

function getToken(): string | null {
  return process.env.KODIK_TOKEN ?? null;
}

interface KodikRawTranslation {
  id: number;
  title: string;
  type?: string;
}

interface KodikRawEpisode {
  link: string;
  screenshots?: string[];
}

interface KodikRawSeason {
  link?: string;
  episodes?: Record<string, string | KodikRawEpisode>;
}

interface KodikRawResult {
  id: string;
  type: string;
  link: string;
  title: string;
  translation?: KodikRawTranslation;
  seasons?: Record<string, KodikRawSeason>;
  last_season?: number;
  last_episode?: number;
}

interface KodikSearchResponse {
  total: number;
  results: KodikRawResult[];
}

function normalizeTranslationKind(type?: string): Translation["kind"] {
  switch (type) {
    case "voice":
      return "voice";
    case "subtitles":
      return "subtitles";
    case "original":
      return "original";
    default:
      return type ? "unknown" : "voice";
  }
}

function toEmbedUrl(link: string): string {
  // Kodik links come as protocol-relative ("//kodik.info/..."); force https.
  if (link.startsWith("//")) return `https:${link}`;
  if (link.startsWith("http")) return link;
  return `https://${link}`;
}

function pickEpisodeLink(
  result: KodikRawResult,
  season: number,
  episode: number,
): string | null {
  const seasonNode = result.seasons?.[String(season)];
  if (!seasonNode) return result.link ? result.link : null;

  const epRaw = seasonNode.episodes?.[String(episode)];
  if (epRaw) {
    return typeof epRaw === "string" ? epRaw : epRaw.link;
  }
  return seasonNode.link ?? result.link ?? null;
}

async function kodikSearch(tmdbId: number): Promise<KodikRawResult[]> {
  const token = getToken();
  if (!token) throw new Error("No Kodik token");

  const url = new URL(`${KODIK_BASE}/search`);
  url.searchParams.set("token", token);
  url.searchParams.set("tmdb_id", String(tmdbId));
  url.searchParams.set("with_seasons", "true");
  url.searchParams.set("with_episodes", "true");

  const res = await fetch(url.toString(), {
    next: { revalidate: 1800 },
  });

  if (!res.ok) {
    throw new Error(`Kodik error: ${res.status}`);
  }

  const data = (await res.json()) as KodikSearchResponse;
  return data.results ?? [];
}

function mockStreams(kind: MediaType): PlaybackStream[] {
  const base: Array<{ id: string; title: string }> = [
    { id: "demo-dub", title: "Дубляж (демо)" },
    { id: "demo-multi", title: "Многоголосый (демо)" },
  ];
  return base.map(({ id, title }) => ({
    translation: { id, title, kind: "voice" },
    embedUrl: "",
    ...(kind === "tv" ? { seasonCount: 1, episodeCount: 1 } : {}),
  }));
}

/**
 * Resolve normalized playback streams for a TMDB title.
 * For movies, `season`/`episode` are ignored.
 * For tv, the embed URL points at the requested season/episode when available.
 */
export async function getPlayback(
  tmdbId: number,
  kind: MediaType,
  season = 1,
  episode = 1,
): Promise<PlaybackResult> {
  const base: PlaybackResult = { tmdbId, kind, streams: [] };
  if (kind === "tv") {
    base.season = season;
    base.episode = episode;
  }

  if (KODIK_DEMO_MODE) {
    return { ...base, streams: mockStreams(kind) };
  }

  const results = await kodikSearch(tmdbId);

  const streams: PlaybackStream[] = [];
  const seen = new Set<string>();

  for (const result of results) {
    const translationId = result.translation
      ? String(result.translation.id)
      : result.id;
    if (seen.has(translationId)) continue;

    const link =
      kind === "tv"
        ? pickEpisodeLink(result, season, episode)
        : result.link;
    if (!link) continue;

    const translation: Translation = {
      id: translationId,
      title: result.translation?.title ?? "Оригинал",
      kind: normalizeTranslationKind(result.translation?.type),
    };

    const stream: PlaybackStream = {
      translation,
      embedUrl: toEmbedUrl(link),
    };

    if (kind === "tv") {
      stream.seasonCount = result.last_season;
      const seasonNode = result.seasons?.[String(season)];
      stream.episodeCount = seasonNode?.episodes
        ? Object.keys(seasonNode.episodes).length
        : result.last_episode;
    }

    seen.add(translationId);
    streams.push(stream);
  }

  return { ...base, streams };
}
