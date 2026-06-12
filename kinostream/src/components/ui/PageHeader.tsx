interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
}

export function PageHeader({ title, subtitle, badge }: PageHeaderProps) {
  return (
    <header className="relative mb-10 overflow-hidden rounded-xl border border-white/8 bg-surface px-6 py-10 sm:px-10">
      {badge && (
        <span className="mb-3 inline-block rounded-md border border-rose-600/30 bg-rose-600/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-rose-400">
          {badge}
        </span>
      )}
      <h1 className="text-3xl font-bold text-white sm:text-4xl">{title}</h1>
      {subtitle && (
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-400">
          {subtitle}
        </p>
      )}
    </header>
  );
}
