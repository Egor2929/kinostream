import type { MediaType, PlaybackResult } from "@/types/media";

/**
 * Client/server-safe data accessor for playback sources.
 *
 * Always goes through the `/api/playback` proxy — it never touches Kodik
 * directly and never sees Kodik response shapes. Usable from client
 * components (player flow) and from server components alike.
 */

export interface FetchPlaybackParams {
  tmdbId: number;
  kind: MediaType;
  season?: number;
  episode?: number;
  /** Absolute origin, required only when called during SSR. */
  baseUrl?: string;
  signal?: AbortSignal;
}

export async function fetchPlayback({
  tmdbId,
  kind,
  season,
  episode,
  baseUrl = "",
  signal,
}: FetchPlaybackParams): Promise<PlaybackResult> {
  const params = new URLSearchParams({
    kind,
    tmdbId: String(tmdbId),
  });
  if (kind === "tv") {
    params.set("season", String(season ?? 1));
    params.set("episode", String(episode ?? 1));
  }

  const res = await fetch(`${baseUrl}/api/playback?${params.toString()}`, {
    signal,
  });

  if (!res.ok) {
    throw new Error(`Playback request failed: ${res.status}`);
  }

  return (await res.json()) as PlaybackResult;
}
