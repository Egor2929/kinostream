"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

const AD_VIDEOS = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
];

interface PreRollAdProps {
  duration?: number;
  onComplete: () => void;
  title: string;
}

export function PreRollAd({ duration = 15, onComplete, title }: PreRollAdProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [remaining, setRemaining] = useState(duration);
  const [muted, setMuted] = useState(true);
  const [started, setStarted] = useState(false);
  // Use lazy initializer to avoid impurity warning
  const [adSrc] = useState(() => AD_VIDEOS[Math.floor(Math.random() * AD_VIDEOS.length)]);


  const handleComplete = useCallback(() => {
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    if (!started) return;

    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [started, handleComplete]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const play = async () => {
      try {
        await video.play();
        setStarted(true);
      } catch {
        setStarted(true);
      }
    };

    play();
  }, []);

  const progress = ((duration - remaining) / duration) * 100;

  return (
    <div className="letterbox relative aspect-video w-full overflow-hidden rounded-3xl bg-black ring-1 ring-white/10 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.8)]">
      <video
        ref={videoRef}
        src={adSrc}
        className="h-full w-full object-cover"
        muted={muted}
        playsInline
        autoPlay
        loop
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

      <div className="absolute left-6 top-6 flex items-center gap-3">
        <span className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-black shadow-md shadow-amber-950/20">
          Реклама
        </span>
        <span className="rounded-lg border border-white/5 bg-black/60 px-3 py-1.5 text-xs font-semibold text-zinc-300 backdrop-blur-md">
          Пропуск через {remaining} сек
        </span>
      </div>

      <button
        type="button"
        onClick={() => setMuted((m) => !m)}
        className="absolute right-6 top-6 rounded-full border border-white/5 bg-black/60 p-3 text-white backdrop-blur-md transition-all duration-300 hover:bg-black/80 hover:scale-105 active:scale-95 shadow-md"
        aria-label={muted ? "Включить звук" : "Выключить звук"}
      >
        {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </button>

      <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
        <p className="mb-3 text-sm text-zinc-400">
          Далее: <span className="font-bold text-white transition-colors duration-300 hover:text-amber-400">{title}</span>
        </p>
        <div className="h-1.5 overflow-hidden rounded-full bg-white/10 backdrop-blur-sm">
          <div
            className="h-full bg-amber-500 rounded-full shadow-[0_0_12px_rgba(232,163,23,0.8)] transition-all duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="rounded-2xl border border-white/5 bg-black/55 px-10 py-7 text-center backdrop-blur-md shadow-2xl transition-all duration-500 scale-100">
          <p className="font-display text-3xl font-extrabold tracking-wider text-amber-400">KinoStream Ads</p>
          <p className="mt-1.5 text-sm font-medium text-zinc-300">Бесплатный просмотр в высоком качестве</p>
        </div>
      </div>
    </div>
  );
}
