import type { CastMember, MediaItem, MovieDetails, TVDetails, Video } from "@/types/media";

const movies: MediaItem[] = [
  {
    id: 550,
    title: "Бойцовский клуб",
    overview:
      "Сотрудник страховой компании страдает хронической бессонницей и отчаянно пытается вырваться из мучительно скучной жизни.",
    poster_path: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    backdrop_path: "/52AvNwZ6J8fE42Upeccyi3XZKZh.jpg",
    vote_average: 8.4,
    release_date: "1999-10-15",
    media_type: "movie",
  },
  {
    id: 157336,
    title: "Интерстеллар",
    overview:
      "Когда засуха приводит человечество к продовольственному кризису, коллектив исследователей отправляется сквозь червоточину.",
    poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdrop_path: "/xJHokMbl3gJMRwcT43h8Zq6Z1Yb.jpg",
    vote_average: 8.5,
    release_date: "2014-11-06",
    media_type: "movie",
  },
  {
    id: 27205,
    title: "Начало",
    overview:
      "Дом Кобб — талантливый вор, лучший из лучших в опасном искусстве извлечения — кражи ценных секретов из глубин подсознания.",
    poster_path: "/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
    backdrop_path: "/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
    vote_average: 8.4,
    release_date: "2010-07-15",
    media_type: "movie",
  },
  {
    id: 155,
    title: "Тёмный рыцарь",
    overview: "Бэтмен поднимает ставки в войне с криминалом, чтобы очистить улицы от отбросов общества.",
    poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    backdrop_path: "/hkBaDkMWbLaf8B1lsWsKX7EwQcb.jpg",
    vote_average: 8.5,
    release_date: "2008-07-16",
    media_type: "movie",
  },
  {
    id: 680,
    title: "Криминальное чтиво",
    overview: "Двое бандитов Винсент Вега и Джулс Винфилд ведут философские беседы в перерывах между разборками.",
    poster_path: "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    backdrop_path: "/suaEOtk1N292sn6Ss7PSGr6AZSq.jpg",
    vote_average: 8.5,
    release_date: "1994-09-10",
    media_type: "movie",
  },
  {
    id: 13,
    title: "Форрест Гамп",
    overview: "Судьба забросила простодушного Форреста Гампа в водоворот ключевых событий второй половины XX века.",
    poster_path: "/arw2vcBveWOVZr6pxdhuMPd8XMJ.jpg",
    backdrop_path: "/7c9UV0iK9H22vdfngADMCyHu5R1.jpg",
    vote_average: 8.5,
    release_date: "1994-06-23",
    media_type: "movie",
  },
];

const series: MediaItem[] = [
  {
    id: 1396,
    title: "Во все тяжкие",
    overview: "Учитель химии Уолтер Уайт узнаёт, что болен раком, и начинает варить метамфетамин.",
    poster_path: "/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
    backdrop_path: "/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg",
    vote_average: 8.9,
    first_air_date: "2008-01-20",
    media_type: "tv",
  },
  {
    id: 1399,
    title: "Игра престолов",
    overview: "К зиме, которая длится целое поколение, Семь Королевств готовятся к столкновению.",
    poster_path: "/1XS1oqL89opfnbLl8W4ZYbPiuif.jpg",
    backdrop_path: "/2OMB0ynKlyIenMJWI2y9JtlioYs.jpg",
    vote_average: 8.4,
    first_air_date: "2011-04-17",
    media_type: "tv",
  },
  {
    id: 66732,
    title: "Очень странные дела",
    overview: "Когда исчезает мальчик, жители маленького городка сталкиваются с тайнами и ужасными экспериментами.",
    poster_path: "/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
    backdrop_path: "/56v2KjBlU4XaOv9rVYEQypROD7h.jpg",
    vote_average: 8.6,
    first_air_date: "2016-07-15",
    media_type: "tv",
  },
];

export const DEMO_MODE = !process.env.TMDB_API_KEY;

export function mockTrending(): MediaItem[] {
  return [...movies.slice(0, 3), ...series.slice(0, 2), ...movies.slice(3)];
}

export function mockMovies(): MediaItem[] {
  return movies;
}

export function mockTV(): MediaItem[] {
  return series;
}

export function mockDiscoverMovies(page = 1) {
  void page;
  return { items: movies, totalPages: 3 };
}

export function mockDiscoverTV(page = 1) {
  void page;
  return { items: series, totalPages: 2 };
}

export function mockSearch(query: string): MediaItem[] {
  const q = query.toLowerCase();
  return [...movies, ...series].filter(
    (m) => m.title.toLowerCase().includes(q) || m.overview.toLowerCase().includes(q),
  );
}

export function mockMovieDetails(id: number): MovieDetails | null {
  const m = movies.find((x) => x.id === id);
  if (!m) return null;
  return {
    ...m,
    runtime: 139,
    genres: [{ id: 18, name: "Драма" }],
    tagline: "Демо-режим",
    status: "Released",
  };
}

export function mockTVDetails(id: number): TVDetails | null {
  const s = series.find((x) => x.id === id);
  if (!s) return null;
  return {
    ...s,
    number_of_seasons: 5,
    number_of_episodes: 62,
    genres: [{ id: 18, name: "Драма" }],
    status: "Ended",
    seasons: [
      { id: 1, season_number: 1, name: "Сезон 1", episode_count: 10, poster_path: s.poster_path },
      { id: 2, season_number: 2, name: "Сезон 2", episode_count: 12, poster_path: s.poster_path },
    ],
  };
}

export function mockCast(): CastMember[] {
  return [
    { id: 1, name: "Актёр 1", character: "Главный герой", profile_path: null },
    { id: 2, name: "Актёр 2", character: "Антагонист", profile_path: null },
    { id: 3, name: "Актёр 3", character: "Напарник", profile_path: null },
  ];
}

export function mockVideos(): Video[] {
  return [
    {
      id: "1",
      key: "dQw4w9WgXcQ",
      name: "Official Trailer",
      site: "YouTube",
      type: "Trailer",
      official: true,
    },
  ];
}

export function mockSimilar(items: MediaItem[]): MediaItem[] {
  return items.slice(0, 4);
}
