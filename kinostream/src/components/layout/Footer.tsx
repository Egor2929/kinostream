import Link from "next/link";
import { Film } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-white/8 bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-600">
                <Film className="h-4 w-4 text-white" />
              </div>
              <span className="font-display text-xl tracking-wide text-white">
                KINO<span className="text-rose-500">REGIN</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-500">
              Бесплатный онлайн-кинотеатр. Тысячи фильмов и сериалов — смотри
              без подписки и регистрации.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Каталог
            </h3>
            <ul className="mt-2">
              {[
                { href: "/movies", label: "Фильмы" },
                { href: "/series", label: "Сериалы" },
                { href: "/new", label: "Новинки" },
                { href: "/search", label: "Поиск" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="inline-flex min-h-[44px] cursor-pointer items-center text-sm text-slate-500 transition-colors duration-200 hover:text-rose-400"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Как это работает
            </h3>
            <ol className="mt-4 space-y-3 text-sm text-slate-500">
              {[
                "Выбираешь фильм или сериал",
                "Нажимаешь «Смотреть»",
                "Наслаждаешься просмотром бесплатно",
              ].map((step, i) => (
                <li key={step} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-rose-600/10 text-xs font-bold text-rose-400">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/8 pt-8 sm:flex-row">
          <p className="text-xs text-slate-600">
            Метаданные: TMDB · KinoRegin © {new Date().getFullYear()}
          </p>
          <p className="text-xs text-slate-600">Сделано для киноманов</p>
        </div>
      </div>
    </footer>
  );
}
