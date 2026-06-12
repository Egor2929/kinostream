"use client";

import { useMemo, useState } from "react";
import type { Trailer } from "@/types/media";
import type { MediaKind } from "@/lib/sources";
import { resolvePlaybackSources } from "@/lib/sources";
import { SourcePicker } from "./SourcePicker";

interface VideoPlayerProps {
  title: string;
  tmdbId: number;
  kind: MediaKind;
  season?: number;
  episode?: number;
  trailer?: Trailer | null;
}

export function VideoPlayer({
  title,
  tmdbId,
  kind,
  season,
  episode,
  trailer,
}: VideoPlayerProps) {
  const sources = useMemo(
    () =>
      resolvePlaybackSources({
        tmdbId,
        kind,
        season,
        episode,
        title,
        trailer,
      }),
    [tmdbId, kind, season, episode, title, trailer],
  );

  const [activeId, setActiveId] = useState(() => sources[0]?.id ?? "");

  const active = sources.find((s) => s.id === activeId) ?? sources[0];

  if (!active) {
    return (
      <div className="flex aspect-video w-full flex-col items-center justify-center rounded-xl border border-white/8 bg-surface p-6 text-center">
        <p className="text-xl font-bold text-white">Видео временно недоступно</p>
        <p className="mt-2.5 max-w-md text-sm text-slate-500">
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

      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/8 bg-black">
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
  );
}
