import { DEMO_MODE } from "@/lib/tmdb";

export function DemoBanner() {
  if (!DEMO_MODE) return null;

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-center text-xs text-amber-300">
      Демо-режим — добавьте{" "}
      <code className="rounded bg-black/30 px-1">TMDB_API_KEY</code> в{" "}
      <code className="rounded bg-black/30 px-1">.env.local</code> для полного каталога
    </div>
  );
}
