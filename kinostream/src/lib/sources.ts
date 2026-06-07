/**
 * Playback source registry.
 * Add your own licensed CDN embed here via NEXT_PUBLIC_CUSTOM_EMBED_URL.
 */

export type MediaKind = "movie" | "tv";

export interface PlaybackParams {
  tmdbId: number;
  kind: MediaKind;
  season?: number;
  episode?: number;
  title?: string;
  youtubeKey?: string | null;
}

export interface PlaybackSource {
  id: string;
  name: string;
  /** Returns embed URL or null if unavailable for this title */
  resolve(params: PlaybackParams): string | null;
}

const SOURCES: PlaybackSource[] = [
  {
    id: "youtube",
    name: "Трейлер",
    resolve({ youtubeKey }) {
      if (!youtubeKey) return null;
      return `https://www.youtube.com/embed/${youtubeKey}?autoplay=1&rel=0&modestbranding=1`;
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
