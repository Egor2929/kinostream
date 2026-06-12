export type MediaType = "movie" | "tv";

export interface MediaItem {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  media_type?: MediaType;
  genre_ids?: number[];
}

export interface MovieDetails extends MediaItem {
  runtime: number | null;
  genres: { id: number; name: string }[];
  tagline?: string;
  status: string;
}

export interface TVDetails extends MediaItem {
  number_of_seasons: number;
  number_of_episodes: number;
  genres: { id: number; name: string }[];
  status: string;
  seasons: TVSeason[];
}

export interface TVSeason {
  id: number;
  season_number: number;
  name: string;
  episode_count: number;
  poster_path: string | null;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

/** Normalized trailer from RU-friendly providers (Kinopoisk, Rutube, VK). */
export type TrailerProvider = "kinopoisk" | "rutube" | "vk";

export interface Trailer {
  provider: TrailerProvider;
  embedUrl: string;
  title: string;
}

export interface TrailerResult {
  tmdbId: number;
  kind: MediaType;
  trailer: Trailer | null;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

/**
 * Content card — the minimal normalized shape used by lists, rows and grids.
 * MediaItem already satisfies it; alias keeps UI-facing intent explicit.
 */
export type ContentCard = MediaItem;

/**
 * Normalized playback contracts.
 * The UI must only ever see these shapes — never raw Kodik responses.
 * Resolving the actual embed URL happens server-side via the playback proxy.
 */

export interface Translation {
  /** Provider-specific translation/voice id (e.g. Kodik translation id). */
  id: string;
  /** Human title, e.g. "Дубляж", "LostFilm". */
  title: string;
  /** Voice kind reported by provider, normalized to a small set. */
  kind: "voice" | "subtitles" | "original" | "unknown";
}

export interface PlaybackStream {
  /** Stable id: `${translationId}` for movies, `${translationId}` for tv. */
  translation: Translation;
  /** Embed URL to be rendered inside an iframe. Always absolute https. */
  embedUrl: string;
  /** Total seasons reported for this translation (tv only). */
  seasonCount?: number;
  /** Episode count for the requested season (tv only). */
  episodeCount?: number;
}

export interface PlaybackResult {
  tmdbId: number;
  kind: MediaType;
  season?: number;
  episode?: number;
  /** Normalized list of available translations/sources. May be empty. */
  streams: PlaybackStream[];
}

export interface ViewingHistoryEntry {
  /** `${kind}:${tmdbId}` for movies, `${kind}:${tmdbId}:${season}:${episode}` for tv. */
  key: string;
  tmdbId: number;
  kind: MediaType;
  title: string;
  poster_path: string | null;
  season?: number;
  episode?: number;
  /** Chosen translation id, if any. */
  translationId?: string;
  /** Playback progress in seconds, if trackable. */
  progressSeconds?: number;
  /** Unix ms of last view. */
  updatedAt: number;
}
