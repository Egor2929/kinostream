"use client";

import { useEffect, useRef, useState } from "react";
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
  const completedRef = useRef(false);
  const [remaining, setRemaining] = useState(duration);
  const [muted, setMuted] = useState(true);
  const [started, setStarted] = useState(false);
  const [adSrc] = useState(() => AD_VIDEOS[Math.floor(Math.random() * AD_VIDEOS.length)]);

  useEffect(() => {
    if (!started) return;

    const interval = setInterval(() => {
      setRemaining((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [started]);

  useEffect(() => {
    if (!started || remaining > 0 || completedRef.current) return;
    completedRef.current = true;
    onComplete();
  }, [started, remaining, onComplete]);

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
    <div className="letterbox relative aspect-video w-full overflow-hidden rounded-xl border border-white/8 bg-black">
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

      <button
        type="button"
        onClick={() => setMuted((m) => !m)}
        className="absolute right-5 top-5 cursor-pointer rounded-lg border border-white/8 bg-black/60 p-3 text-white transition-colors duration-200 hover:bg-black/80"
        aria-label={muted ? "Включить звук" : "Выключить звук"}
      >
        {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </button>

      <div className="absolute bottom-0 left-0 right-0 z-10 p-5">
        <p className="mb-3 text-sm text-slate-400">
          Скоро: <span className="font-semibold text-white">{title}</span>
        </p>
        <div className="h-1 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-rose-600 transition-all duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
