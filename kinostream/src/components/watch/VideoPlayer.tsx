"use client";

import { useMemo, useState } from "react";
import type { MediaKind } from "@/lib/sources";
import { resolvePlaybackSources } from "@/lib/sources";
import { SourcePicker } from "./SourcePicker";

interface VideoPlayerProps {
  title: string;
  tmdbId: number;
  kind: MediaKind;
  season?: number;
  episode?: number;
  youtubeKey?: string | null;
}

export function VideoPlayer({
  title,
  tmdbId,
  kind,
  season,
  episode,
  youtubeKey,
}: VideoPlayerProps) {
  const sources = useMemo(
    () =>
      resolvePlaybackSources({
        tmdbId,
        kind,
        season,
        episode,
        title,
        youtubeKey,
      }),
    [tmdbId, kind, season, episode, title, youtubeKey],
  );

  const [activeId, setActiveId] = useState(() => sources[0]?.id ?? "");

  const active = sources.find((s) => s.id === activeId) ?? sources[0];

  if (!active) {
    return (
      <div className="flex aspect-video w-full flex-col items-center justify-center rounded-3xl bg-zinc-950 p-6 text-center ring-1 ring-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
        <p className="text-xl font-bold text-white">Видео временно недоступно</p>
        <p className="mt-2.5 max-w-md text-sm text-zinc-500">
          Для «{title}» нет доступного источника. Попробуйте позже или выберите
          другой фильм.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <SourcePicker
        sources={sources.map(({ id, name }) => ({ id, name }))}
        activeId={active.id}
        onChange={setActiveId}
      />

      <div className="group/player relative w-full aspect-video">
        <div
          className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-tr from-amber-500/10 via-amber-500/20 to-transparent opacity-75 blur-3xl transition-all duration-1000 group-hover/player:scale-105 group-hover/player:opacity-100"
          aria-hidden="true"
        />

        <div className="relative h-full w-full overflow-hidden rounded-3xl bg-black ring-1 ring-white/10 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.9)] transition-all duration-500 group-hover/player:ring-amber-500/20">
          <iframe
            key={active.embedUrl}
            src={active.embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        </div>
      </div>
    </div>
  );
}
