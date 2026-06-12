"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Film, Menu, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Главная" },
  { href: "/movies", label: "Фильмы" },
  { href: "/series", label: "Сериалы" },
  { href: "/new", label: "Новинки" },
] as const;

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setMenuOpen(false), 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <>
      <header
        className={cn(
          "fixed top-0 z-50 w-full transition-all duration-200",
          scrolled
            ? "glass-panel-heavy"
            : "border-b border-transparent bg-gradient-to-b from-black/90 to-transparent",
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:gap-6 sm:px-6">
          <Link href="/" className="group flex shrink-0 items-center gap-2.5 cursor-pointer">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-600 transition-colors duration-200 group-hover:bg-rose-500">
              <Film className="h-5 w-5 text-white" />
            </div>
            <span className="hidden font-display text-2xl tracking-wide text-white sm:block">
              KINO<span className="text-rose-500">REGIN</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Основная навигация">
            {NAV.map(({ href, label }) => {
              const active =
                href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer",
                    active
                      ? "bg-rose-600/10 text-rose-400"
                      : "text-slate-400 hover:bg-white/5 hover:text-white",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          <form
            onSubmit={handleSearch}
            className="ml-auto flex flex-1 max-w-sm items-center sm:max-w-md"
            role="search"
          >
            <div className="relative w-full group/search">
              <Search
                className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition-colors duration-200 group-focus-within/search:text-rose-500"
                aria-hidden="true"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Найти фильм или сериал..."
                className="min-h-[44px] w-full rounded-lg border border-white/8 bg-surface py-2.5 pl-10 pr-4 text-base text-white placeholder:text-slate-500 transition-colors duration-200 focus:border-rose-600/40 focus:bg-surface-elevated focus:outline-none sm:min-h-0 sm:text-sm"
                aria-label="Поиск"
              />
            </div>
          </form>

          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-white/8 text-slate-300 transition-colors duration-200 hover:border-rose-600/40 hover:text-rose-400 md:hidden"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {menuOpen && (
        <nav
          className="fixed inset-x-0 top-16 z-40 border-b border-white/8 bg-surface p-4 md:hidden"
          aria-label="Мобильная навигация"
        >
          <div className="flex flex-col gap-1">
            {NAV.map(({ href, label }) => {
              const active =
                href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "rounded-lg px-4 py-3 text-base font-medium transition-colors duration-200 cursor-pointer",
                    active
                      ? "bg-rose-600/10 text-rose-400"
                      : "text-slate-300 hover:bg-white/5",
                  )}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </>
  );
}
