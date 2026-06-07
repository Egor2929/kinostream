"use client";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const isConfig = error.message.includes("TMDB_API_KEY");

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <h1 className="font-display text-3xl font-bold text-white">
        {isConfig ? "Нужна настройка" : "Что-то пошло не так"}
      </h1>
      <p className="mt-4 text-zinc-400">
        {isConfig
          ? "Создайте файл .env.local с TMDB_API_KEY. Бесплатный ключ: themoviedb.org/settings/api"
          : error.message}
      </p>
      {!isConfig && (
        <button
          type="button"
          onClick={reset}
          className="mt-8 rounded-full bg-amber-500 px-6 py-2 text-sm font-bold text-black"
        >
          Попробовать снова
        </button>
      )}
    </div>
  );
}
