interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
}

export function PageHeader({ title, subtitle, badge }: PageHeaderProps) {
  return (
    <header className="relative mb-10 overflow-hidden rounded-2xl border border-white/5 bg-surface px-6 py-10 sm:px-10">
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-amber-500/10 blur-3xl"
        aria-hidden="true"
      />
      {badge && (
        <span className="mb-3 inline-block rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-amber-400">
          {badge}
        </span>
      )}
      <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">{title}</h1>
      {subtitle && (
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-zinc-400">{subtitle}</p>
      )}
    </header>
  );
}
