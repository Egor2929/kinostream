import { HeroBanner } from "@/components/home/HeroBanner";
import { ValueProps } from "@/components/home/ValueProps";
import { ContentRow } from "@/components/media/ContentRow";
import { buildMetadata, SITE_NAME, SITE_TAGLINE } from "@/lib/seo";
import {
  getNowPlaying,
  getPopularMovies,
  getPopularTV,
  getTopRatedMovies,
  getTrending,
  getUpcoming,
} from "@/lib/tmdb";

export const revalidate = 3600;

export const metadata = {
  ...buildMetadata({
    title: SITE_NAME,
    description:
      "KinoRegin — бесплатный онлайн-кинотеатр. Тренды, новинки кино, популярные сериалы и топ рейтинга в одном месте.",
    path: "/",
  }),
  title: {
    absolute: `${SITE_NAME} — ${SITE_TAGLINE}`,
  },
};

export default async function HomePage() {
  const [trending, nowPlaying, upcoming, popularMovies, popularTV, topRated] =
    await Promise.all([
      getTrending("all"),
      getNowPlaying(),
      getUpcoming(),
      getPopularMovies(),
      getPopularTV(),
      getTopRatedMovies(),
    ]);

  const hero = trending[0];

  return (
    <>
      {hero && <HeroBanner item={hero} />}
      <ValueProps />
      <div className="mx-auto max-w-7xl">
        <ContentRow title="Сейчас в кино" items={nowPlaying} href="/new" index={0} />
        <ContentRow title="Скоро в прокате" items={upcoming} href="/new" index={1} />
        <ContentRow title="Популярные фильмы" items={popularMovies} href="/movies" type="movie" index={2} />
        <ContentRow title="Популярные сериалы" items={popularTV} href="/series" type="tv" index={3} />
        <ContentRow title="Лучшие фильмы" items={topRated} href="/movies" type="movie" index={4} />
        <ContentRow title="В тренде" items={trending.slice(1, 15)} index={5} />
      </div>
    </>
  );
}
