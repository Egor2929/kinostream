"use client";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const isConfig = error.message.includes("TMDB_API_KEY");

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <h1 className="text-3xl font-bold text-white">
        {isConfig ? "Нужна настройка" : "Что-то пошло не так"}
      </h1>
      <p className="mt-4 text-slate-400">
        {isConfig
          ? "Создайте файл .env.local с переменной TMDB_API_KEY и перезапустите сервер. Ключ выдаётся бесплатно."
          : error.message}
      </p>
      {isConfig ? (
        <a
          href="https://www.themoviedb.org/settings/api"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-cta mt-8 px-6 py-2 text-sm"
        >
          Получить ключ TMDB
        </a>
      ) : (
        <button
          type="button"
          onClick={reset}
          className="btn-cta mt-8 px-6 py-2 text-sm"
        >
          Попробовать снова
        </button>
      )}
    </div>
  );
}
