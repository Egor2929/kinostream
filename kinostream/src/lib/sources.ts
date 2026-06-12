/**
 * Playback source registry.
 * Add your own licensed CDN embed here via NEXT_PUBLIC_CUSTOM_EMBED_URL.
 */

import type { Trailer } from "@/types/media";

export type MediaKind = "movie" | "tv";

export interface PlaybackParams {
  tmdbId: number;
  kind: MediaKind;
  season?: number;
  episode?: number;
  title?: string;
  trailer?: Trailer | null;
}

export interface PlaybackSource {
  id: string;
  name: string;
  /** Returns embed URL or null if unavailable for this title */
  resolve(params: PlaybackParams): string | null;
}

const SOURCES: PlaybackSource[] = [
  {
    id: "trailer",
    name: "Трейлер",
    resolve({ trailer }) {
      if (!trailer?.embedUrl) return null;
      return trailer.embedUrl;
    },
  },
  {
    id: "custom",
    name: "Основной плеер",
    resolve({ tmdbId, kind, season = 1, episode = 1 }) {
      const template = process.env.NEXT_PUBLIC_CUSTOM_EMBED_URL;
      if (!template) return null;

      return template
        .replace("{tmdbId}", String(tmdbId))
        .replace("{kind}", kind)
        .replace("{season}", String(season))
        .replace("{episode}", String(episode));
    },
  },
];

export function resolvePlaybackSources(
  params: PlaybackParams,
): Array<PlaybackSource & { embedUrl: string }> {
  return SOURCES.map((source) => ({
    ...source,
    embedUrl: source.resolve(params) ?? "",
  })).filter((s) => Boolean(s.embedUrl));
}

export function getAllSourceDefs(): Array<{ id: string; name: string }> {
  return SOURCES.map(({ id, name }) => ({ id, name }));
}
