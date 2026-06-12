import type { MetadataRoute } from "next";
import { getPopularMovies, getPopularTV, getTrending } from "@/lib/tmdb";
import { absoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/movies"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/series"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/new"), lastModified: now, changeFrequency: "daily", priority: 0.85 },
    { url: absoluteUrl("/search"), lastModified: now, changeFrequency: "weekly", priority: 0.5 },
  ];

  try {
    const [trending, movies, tv] = await Promise.all([
      getTrending("all"),
      getPopularMovies(),
      getPopularTV(),
    ]);

    const seen = new Set<string>();
    const dynamicRoutes: MetadataRoute.Sitemap = [];

    for (const item of [...trending, ...movies, ...tv]) {
      const type = item.media_type ?? (item.release_date ? "movie" : "tv");
      const path =
        type === "tv" ? `/tv/${item.id}` : `/movie/${item.id}`;
      if (seen.has(path)) continue;
      seen.add(path);

      dynamicRoutes.push({
        url: absoluteUrl(path),
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }

    return [...staticRoutes, ...dynamicRoutes];
  } catch {
    return staticRoutes;
  }
}
