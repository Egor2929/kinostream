import { DEMO_MODE } from "@/lib/tmdb";

export function DemoBanner() {
  if (!DEMO_MODE) return null;

  return (
    <div className="border-b border-rose-600/20 bg-rose-600/10 px-4 py-2 text-center text-xs text-rose-300">
      Демо-режим — добавьте{" "}
      <code className="rounded bg-black/30 px-1">TMDB_API_KEY</code> в{" "}
      <code className="rounded bg-black/30 px-1">.env.local</code> для полного каталога
    </div>
  );
}
