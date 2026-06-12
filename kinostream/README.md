# KinoRegin

Бесплатный онлайн-кинотеатр: каталог фильмов и сериалов.

## Стек

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- [TMDB API](https://www.themoviedb.org/documentation/api) — каталог, поиск, метаданные

## Быстрый старт

1. Получите бесплатный API-ключ на [themoviedb.org](https://www.themoviedb.org/settings/api)

2. Создайте `.env.local`:

```env
TMDB_API_KEY=ваш_ключ
NEXT_PUBLIC_AD_DURATION=15
NEXT_PUBLIC_SITE_URL=https://kinoregin.ru
```

3. Запуск:

```bash
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000)

## Возможности

- Главная с трендами, новинками, популярным контентом
- Каталоги фильмов и сериалов с пагинацией
- Поиск по названию
- Страницы фильма/сериала с актёрами и похожим контентом
- Плеер с автозапуском

## Видеоисточники

Сейчас воспроизводятся официальные трейлеры с YouTube (через TMDB). Для полноценного стриминга подключите лицензированный CDN или собственное хранилище в `VideoPlayer`.
