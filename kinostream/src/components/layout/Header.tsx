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
    // Use a ref to avoid setState-in-effect lint issue
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
          "fixed top-0 z-50 w-full transition-all duration-500",
          scrolled
            ? "glass-panel-heavy shadow-2xl shadow-black/50 border-b border-white/5"
            : "border-b border-transparent bg-gradient-to-b from-black/90 via-black/30 to-transparent",
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:gap-6 sm:px-6">
          <Link href="/" className="group flex shrink-0 items-center gap-2.5">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 shadow-md shadow-amber-950/40 transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(232,163,23,0.3)]">
              <Film className="h-5 w-5 text-black transition-transform duration-300 group-hover:rotate-12" />
            </div>
            <span className="hidden font-display text-2xl tracking-wider text-white sm:block transition-colors duration-300">
              KINO<span className="text-amber-400 group-hover:text-amber-300 transition-colors duration-300">STREAM</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1.5 md:flex" aria-label="Основная навигация">
            {NAV.map(({ href, label }) => {
              const active =
                href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "relative rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-300",
                    active
                      ? "text-amber-400 bg-amber-400/5 ring-1 ring-amber-400/15"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {label}
                  {active && (
                    <span className="absolute inset-x-4 -bottom-px h-0.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(232,163,23,0.8)]" />
                  )}
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
                className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 transition-colors duration-300 group-focus-within/search:text-amber-400"
                aria-hidden="true"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Найти фильм или сериал..."
                className="w-full rounded-full border border-white/5 bg-white/3 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-zinc-500 transition-all duration-300 focus:border-amber-500/30 focus:bg-black/60 focus:ring-2 focus:ring-amber-500/10 focus:shadow-[0_0_20px_rgba(232,163,23,0.06)] outline-none"
                aria-label="Поиск"
              />
            </div>
          </form>

          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 text-zinc-300 transition hover:border-amber-400/40 hover:text-amber-400 md:hidden"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {menuOpen && (
        <nav
          className="fixed inset-x-0 top-16 z-40 border-b border-white/5 bg-[#050508]/95 p-4 backdrop-blur-2xl md:hidden"
          aria-label="Мобильная навигация"
        >
          <div className="flex flex-col gap-1.5">
            {NAV.map(({ href, label }) => {
              const active =
                href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "rounded-xl px-4 py-3 text-base font-medium transition-all duration-300",
                    active
                      ? "bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20"
                      : "text-zinc-300 hover:bg-white/5",
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
