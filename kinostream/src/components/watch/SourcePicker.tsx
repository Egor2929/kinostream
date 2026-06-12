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
              "cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200",
              active
                ? "bg-rose-600 text-white"
                : "border border-white/8 text-slate-400 hover:border-rose-600/40 hover:text-white",
            )}
          >
            {source.name}
          </button>
        );
      })}
    </div>
  );
}
