"use client";

import { useState } from "react";
import type { MediaKind } from "@/lib/sources";
import { PreRollAd } from "./PreRollAd";
import { VideoPlayer } from "./VideoPlayer";

interface WatchExperienceProps {
  title: string;
  tmdbId: number;
  kind: MediaKind;
  season?: number;
  episode?: number;
  youtubeKey?: string | null;
  adDuration?: number;
}

export function WatchExperience({
  title,
  tmdbId,
  kind,
  season,
  episode,
  youtubeKey,
  adDuration,
}: WatchExperienceProps) {
  const [adWatched, setAdWatched] = useState(false);
  const duration =
    adDuration ?? Number(process.env.NEXT_PUBLIC_AD_DURATION ?? 15);

  if (!adWatched) {
    return (
      <PreRollAd
        duration={duration}
        title={title}
        onComplete={() => setAdWatched(true)}
      />
    );
  }

  return (
    <VideoPlayer
      title={title}
      tmdbId={tmdbId}
      kind={kind}
      season={season}
      episode={episode}
      youtubeKey={youtubeKey}
    />
  );
}
