import Link from "next/link";
import { Film } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-white/5 bg-[#030306]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500">
                <Film className="h-4 w-4 text-black" />
              </div>
              <span className="font-display text-xl tracking-wider text-white">
                KINO<span className="text-amber-400">STREAM</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-zinc-500">
              Бесплатный онлайн-кинотеатр. Тысячи фильмов и сериалов — смотри
              без подписки, только короткая реклама перед просмотром.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
              Каталог
            </h3>
            <ul className="mt-4 space-y-2.5">
              {[
                { href: "/movies", label: "Фильмы" },
                { href: "/series", label: "Сериалы" },
                { href: "/new", label: "Новинки" },
                { href: "/search", label: "Поиск" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-zinc-500 transition hover:text-amber-400"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
              Как это работает
            </h3>
            <ol className="mt-4 space-y-3 text-sm text-zinc-500">
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-xs font-bold text-amber-400">
                  1
                </span>
                Выбираешь фильм или сериал
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-xs font-bold text-amber-400">
                  2
                </span>
                Смотришь короткую рекламу
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-xs font-bold text-amber-400">
                  3
                </span>
                Наслаждаешься просмотром бесплатно
              </li>
            </ol>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row">
          <p className="text-xs text-zinc-600">
            Метаданные: TMDB · KinoStream © {new Date().getFullYear()}
          </p>
          <p className="text-xs text-zinc-600">Сделано с 🎬 для киноманов</p>
        </div>
      </div>
    </footer>
  );
}
