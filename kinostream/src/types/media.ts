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
