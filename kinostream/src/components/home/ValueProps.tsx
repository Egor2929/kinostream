import { Clapperboard, Sparkles, Tv } from "lucide-react";

const ITEMS = [
  {
    icon: Tv,
    title: "Тысячи тайтлов",
    text: "Фильмы и сериалы из каталога TMDB — всегда актуально",
  },
  {
    icon: Sparkles,
    title: "Без подписки",
    text: "Смотрите бесплатно — без регистрации и скрытых платежей",
  },
  {
    icon: Clapperboard,
    title: "Премьеры и тренды",
    text: "Новинки, топ рейтинга и подборки на главной",
  },
] as const;

export function ValueProps() {
  return (
    <section
      className="border-y border-white/5 bg-surface"
      aria-label="Преимущества KinoRegin"
    >
      <div className="mx-auto grid max-w-7xl gap-px bg-white/5 sm:grid-cols-3">
        {ITEMS.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="flex flex-col gap-3 bg-surface px-6 py-8 sm:px-8"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-600/15 text-rose-500">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <h2 className="text-sm font-semibold text-white">{title}</h2>
            <p className="text-sm leading-relaxed text-slate-400">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
