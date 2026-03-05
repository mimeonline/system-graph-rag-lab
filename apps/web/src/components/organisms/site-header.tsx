"use client";

import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_LINKS } from "@/config/site";
import { TrackedLink } from "@/components/molecules/tracked-link";

export function SiteHeader(): React.JSX.Element {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-[#173663] bg-[#0c2345]/95 text-white backdrop-blur">
      <div className="mx-auto flex min-h-16 w-full max-w-[1180px] items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-2">
        <div className="min-w-0 flex items-center gap-2.5 sm:gap-3">
          <p className="truncate text-sm font-semibold tracking-[0.01em]">System GraphRAG Lab</p>
          <span className="hidden text-[11px] uppercase tracking-[0.16em] text-slate-300 sm:inline">Public Showcase</span>
        </div>

        <button
          type="button"
          className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-md border border-white/15 bg-white/5 text-white transition hover:bg-white/10 sm:hidden"
          onClick={() => setIsMobileMenuOpen((current) => !current)}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-nav"
          aria-label={isMobileMenuOpen ? "Menü schließen" : "Menü öffnen"}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
        </button>

        <nav className="hidden items-center gap-1.5 text-sm sm:flex sm:w-auto sm:flex-wrap sm:justify-end" aria-label="Hauptnavigation">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <TrackedLink
                key={link.href}
                href={link.href}
                label={link.label}
                eventName="nav_click"
                payload={{ href: link.href }}
                className={`inline-flex items-center justify-center rounded-md px-3 py-1.5 text-center transition ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "text-slate-100 hover:bg-white/10"
                }`}
              />
            );
          })}
        </nav>
      </div>

      {isMobileMenuOpen ? (
        <div id="mobile-nav" className="border-t border-white/10 bg-[#102b54] sm:hidden">
          <nav className="mx-auto grid w-full max-w-[1180px] gap-2 px-4 py-3" aria-label="Hauptnavigation mobil">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <TrackedLink
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  eventName="nav_click"
                  payload={{ href: link.href }}
                  className={`inline-flex min-h-11 items-center justify-center rounded-md px-4 py-3 text-sm font-medium text-center transition ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-white/5 text-slate-100 hover:bg-white/10"
                  }`}
                />
              );
            })}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
