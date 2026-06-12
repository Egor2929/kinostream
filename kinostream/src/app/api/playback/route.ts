import { NextResponse } from "next/server";
import { getPlayback } from "@/lib/kodik";
import type { MediaType } from "@/types/media";

/**
 * Server-side playback proxy.
 *
 * The client calls this endpoint instead of Kodik directly, so the Kodik
 * token and response format never reach the browser. Returns a normalized
 * `PlaybackResult`.
 *
 * GET /api/playback?kind=movie&tmdbId=550
 * GET /api/playback?kind=tv&tmdbId=1396&season=1&episode=1
 */

export const runtime = "nodejs";

function parseKind(value: string | null): MediaType | null {
  return value === "movie" || value === "tv" ? value : null;
}

function parsePositiveInt(value: string | null): number | null {
  if (value === null) return null;
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const kind = parseKind(searchParams.get("kind"));
  const tmdbId = parsePositiveInt(searchParams.get("tmdbId"));

  if (!kind || !tmdbId) {
    return NextResponse.json(
      { error: "Invalid params: kind (movie|tv) and tmdbId are required" },
      { status: 400 },
    );
  }

  const season = parsePositiveInt(searchParams.get("season")) ?? 1;
  const episode = parsePositiveInt(searchParams.get("episode")) ?? 1;

  try {
    const result = await getPlayback(tmdbId, kind, season, episode);
    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=600",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Playback source unavailable" },
      { status: 502 },
    );
  }
}
