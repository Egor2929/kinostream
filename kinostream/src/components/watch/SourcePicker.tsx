"use client";

import { cn } from "@/lib/utils";

interface SourceOption {
  id: string;
  name: string;
}

interface SourcePickerProps {
  sources: SourceOption[];
  activeId: string;
  onChange: (id: string) => void;
}

export function SourcePicker({ sources, activeId, onChange }: SourcePickerProps) {
  if (sources.length <= 1) return null;

  return (
    <div
      className="mb-4 flex flex-wrap gap-2"
      role="tablist"
      aria-label="Источник воспроизведения"
    >
      {sources.map((source) => {
        const active = source.id === activeId;
        return (
          <button
            key={source.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(source.id)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition",
              active
                ? "bg-amber-500 text-black"
                : "border border-white/10 text-zinc-400 hover:border-amber-400/40 hover:text-white",
            )}
          >
            {source.name}
          </button>
        );
      })}
    </div>
  );
}
