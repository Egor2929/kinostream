import type {
  CastMember,
  MediaItem,
  MovieDetails,
  TMDBResponse,
  TVDetails,
  Video,
} from "@/types/media";
import * as mock from "@/lib/mock-data";

const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_IMAGE = "https://image.tmdb.org/t/p";

export { TMDB_IMAGE };
export { DEMO_MODE } from "@/lib/mock-data";

function getApiKey(): string | null {
  return process.env.TMDB_API_KEY ?? null;
}

async function tmdbFetch<T>(
  path: string,
  params: Record<string, string> = {},
): Promise<T> {
  const url = new URL(`${TMDB_BASE}${path}`);
  const key = getApiKey();
  if (!key) throw new Error("No API key");
  url.searchParams.set("api_key", key);
  url.searchParams.set("language", "ru-RU");
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`TMDB error: ${res.status} ${path}`);
  }

  return res.json() as Promise<T>;
}

function normalizeMedia<T extends Record<string, unknown>>(item: T): MediaItem {
  const title =
    (item.title as string) ?? (item.name as string) ?? "Без названия";

  return {
    id: item.id as number,
    title,
    overview: (item.overview as string) ?? "",
    poster_path: (item.poster_path as string | null) ?? null,
    backdrop_path: (item.backdrop_path as string | null) ?? null,
    vote_average: (item.vote_average as number) ?? 0,
    release_date: item.release_date as string | undefined,
    first_air_date: item.first_air_date as string | undefined,
    media_type: item.media_type as MediaItem["media_type"],
    genre_ids: item.genre_ids as number[] | undefined,
  };
}

export async function getTrending(
  mediaType: "all" | "movie" | "tv" = "all",
): Promise<MediaItem[]> {
  if (mock.DEMO_MODE) return mock.mockTrending();
  const data = await tmdbFetch<TMDBResponse<Record<string, unknown>>>(
    `/trending/${mediaType}/week`,
  );
  return data.results.map(normalizeMedia);
}

export async function getPopularMovies(): Promise<MediaItem[]> {
  if (mock.DEMO_MODE) return mock.mockMovies();
  const data = await tmdbFetch<TMDBResponse<Record<string, unknown>>>(
    "/movie/popular",
  );
  return data.results.map(normalizeMedia);
}

export async function getPopularTV(): Promise<MediaItem[]> {
  if (mock.DEMO_MODE) return mock.mockTV();
  const data = await tmdbFetch<TMDBResponse<Record<string, unknown>>>(
    "/tv/popular",
  );
  return data.results.map(normalizeMedia);
}

export async function getNowPlaying(): Promise<MediaItem[]> {
  if (mock.DEMO_MODE) return mock.mockMovies().slice(0, 4);
  const data = await tmdbFetch<TMDBResponse<Record<string, unknown>>>(
    "/movie/now_playing",
  );
  return data.results.map(normalizeMedia);
}

export async function getUpcoming(): Promise<MediaItem[]> {
  if (mock.DEMO_MODE) return mock.mockMovies().slice(2, 6);
  const data = await tmdbFetch<TMDBResponse<Record<string, unknown>>>(
    "/movie/upcoming",
  );
  return data.results.map(normalizeMedia);
}

export async function getTopRatedMovies(): Promise<MediaItem[]> {
  if (mock.DEMO_MODE) return mock.mockMovies();
  const data = await tmdbFetch<TMDBResponse<Record<string, unknown>>>(
    "/movie/top_rated",
  );
  return data.results.map(normalizeMedia);
}

export async function getTopRatedTV(): Promise<MediaItem[]> {
  if (mock.DEMO_MODE) return mock.mockTV();
  const data = await tmdbFetch<TMDBResponse<Record<string, unknown>>>(
    "/tv/top_rated",
  );
  return data.results.map(normalizeMedia);
}

export async function searchMulti(query: string): Promise<MediaItem[]> {
  if (!query.trim()) return [];
  if (mock.DEMO_MODE) return mock.mockSearch(query);
  const data = await tmdbFetch<TMDBResponse<Record<string, unknown>>>(
    "/search/multi",
    { query: query.trim(), include_adult: "false" },
  );
  return data.results
    .filter((item) => item.media_type === "movie" || item.media_type === "tv")
    .map(normalizeMedia);
}

export async function getMovieDetails(id: number): Promise<MovieDetails> {
  if (mock.DEMO_MODE) {
    const m = mock.mockMovieDetails(id);
    if (!m) throw new Error("Not found");
    return m;
  }
  const data = await tmdbFetch<Record<string, unknown>>(`/movie/${id}`);
  const base = normalizeMedia(data);
  return {
    ...base,
    runtime: (data.runtime as number | null) ?? null,
    genres: (data.genres as MovieDetails["genres"]) ?? [],
    tagline: data.tagline as string | undefined,
    status: (data.status as string) ?? "",
  };
}

export async function getTVDetails(id: number): Promise<TVDetails> {
  if (mock.DEMO_MODE) {
    const s = mock.mockTVDetails(id);
    if (!s) throw new Error("Not found");
    return s;
  }
  const data = await tmdbFetch<Record<string, unknown>>(`/tv/${id}`);
  const base = normalizeMedia(data);
  return {
    ...base,
    number_of_seasons: (data.number_of_seasons as number) ?? 0,
    number_of_episodes: (data.number_of_episodes as number) ?? 0,
    genres: (data.genres as TVDetails["genres"]) ?? [],
    status: (data.status as string) ?? "",
    seasons: ((data.seasons as TVDetails["seasons"]) ?? []).filter(
      (s) => s.season_number > 0,
    ),
  };
}

export async function getMovieCredits(id: number): Promise<CastMember[]> {
  if (mock.DEMO_MODE) return mock.mockCast();
  const data = await tmdbFetch<{ cast: CastMember[] }>(`/movie/${id}/credits`);
  return data.cast.slice(0, 12);
}

export async function getTVCredits(id: number): Promise<CastMember[]> {
  if (mock.DEMO_MODE) return mock.mockCast();
  const data = await tmdbFetch<{ cast: CastMember[] }>(`/tv/${id}/credits`);
  return data.cast.slice(0, 12);
}

export async function getSimilarMovies(id: number): Promise<MediaItem[]> {
  if (mock.DEMO_MODE) return mock.mockSimilar(mock.mockMovies());
  const data = await tmdbFetch<TMDBResponse<Record<string, unknown>>>(
    `/movie/${id}/similar`,
  );
  return data.results.map(normalizeMedia);
}

export async function getSimilarTV(id: number): Promise<MediaItem[]> {
  if (mock.DEMO_MODE) return mock.mockSimilar(mock.mockTV());
  const data = await tmdbFetch<TMDBResponse<Record<string, unknown>>>(
    `/tv/${id}/similar`,
  );
  return data.results.map(normalizeMedia);
}

export async function getMovieVideos(id: number): Promise<Video[]> {
  if (mock.DEMO_MODE) return mock.mockVideos();
  const data = await tmdbFetch<{ results: Video[] }>(`/movie/${id}/videos`);
  return data.results;
}

export async function getTVVideos(id: number): Promise<Video[]> {
  if (mock.DEMO_MODE) return mock.mockVideos();
  const data = await tmdbFetch<{ results: Video[] }>(`/tv/${id}/videos`);
  return data.results;
}

export function pickBestVideo(videos: Video[]): Video | null {
  const youtube = videos.filter((v) => v.site === "YouTube");
  const trailer =
    youtube.find((v) => v.type === "Trailer" && v.official) ??
    youtube.find((v) => v.type === "Trailer") ??
    youtube[0];
  return trailer ?? null;
}

export async function discoverMovies(page = 1): Promise<{
  items: MediaItem[];
  totalPages: number;
}> {
  if (mock.DEMO_MODE) return mock.mockDiscoverMovies(page);
  const data = await tmdbFetch<TMDBResponse<Record<string, unknown>>>(
    "/discover/movie",
    {
      page: String(page),
      sort_by: "popularity.desc",
    },
  );
  return {
    items: data.results.map(normalizeMedia),
    totalPages: data.total_pages,
  };
}

export async function discoverTV(page = 1): Promise<{
  items: MediaItem[];
  totalPages: number;
}> {
  if (mock.DEMO_MODE) return mock.mockDiscoverTV(page);
  const data = await tmdbFetch<TMDBResponse<Record<string, unknown>>>(
    "/discover/tv",
    {
      page: String(page),
      sort_by: "popularity.desc",
    },
  );
  return {
    items: data.results.map(normalizeMedia),
    totalPages: data.total_pages,
  };
}
