"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";
import { TrackedLink } from "@/components/molecules/tracked-link";
import { useLocale, useTranslations } from "next-intl";
import type { AppLocale } from "@/i18n/config";
import { usePathname } from "@/i18n/navigation";

const NAV_LINKS = [
  { labelKey: "home", href: "/" },
  { labelKey: "demo", href: "/demo" },
  { labelKey: "story", href: "/story/graphrag" },
  { labelKey: "essay", href: "/essay" },
  { labelKey: "about", href: "/about" },
] as const;

export function SiteHeader(): React.JSX.Element {
  const tNav = useTranslations("Navigation");
  const tHeader = useTranslations("SiteHeader");
  const tLocale = useTranslations("LocaleSwitcher");
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const localeItems: AppLocale[] = ["de", "en"];

  return (
    <header className="sticky top-0 z-40 border-b border-[#173663] bg-[#0c2345]/95 text-white backdrop-blur">
      <div className="mx-auto flex min-h-16 w-full max-w-[1180px] items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-2">
        <div className="min-w-0 flex items-center gap-2.5 sm:gap-3">
          <p className="truncate text-sm font-semibold tracking-[0.01em]">System GraphRAG Lab</p>
          <span className="hidden text-[11px] uppercase tracking-[0.16em] text-slate-300 sm:inline">
            {tHeader("productBadge")}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-md border border-white/15 bg-white/5 text-white transition hover:bg-white/10 sm:hidden"
            onClick={() => setIsMobileMenuOpen((current) => !current)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav"
            aria-label={isMobileMenuOpen ? tHeader("menuClose") : tHeader("menuOpen")}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>

          <nav
            className="hidden items-center gap-1.5 text-sm sm:flex sm:w-auto sm:flex-wrap sm:justify-end"
            aria-label={tHeader("navigationLabel")}
          >
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <TrackedLink
                  key={link.href}
                  href={link.href}
                  label={tNav(link.labelKey)}
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

          <div
            className="hidden items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-300 sm:inline-flex"
            aria-label={tLocale("label")}
          >
            {localeItems.map((item) =>
              item === locale ? (
                <span
                  key={item}
                  className="rounded bg-white/12 px-1.5 py-1 text-white"
                  aria-current="true"
                >
                  {item.toUpperCase()}
                </span>
              ) : (
                <TrackedLink
                  key={item}
                  href={pathname}
                  locale={item}
                  label={item.toUpperCase()}
                  eventName="locale_switch"
                  payload={{ from: locale, to: item, pathname }}
                  className="rounded px-1.5 py-1 text-slate-300 transition hover:bg-white/8 hover:text-white"
                />
              ),
            )}
          </div>
        </div>
      </div>

      {isMobileMenuOpen ? (
        <div id="mobile-nav" className="border-t border-white/10 bg-[#102b54] sm:hidden">
          <nav
            className="mx-auto grid w-full max-w-[1180px] gap-2 px-4 py-3"
            aria-label={tHeader("mobileNavigationLabel")}
          >
            <div
              className="flex items-center justify-center gap-1 pb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-300"
              aria-label={tLocale("label")}
            >
              {localeItems.map((item) =>
                item === locale ? (
                  <span key={item} className="rounded bg-white/12 px-1.5 py-1 text-white" aria-current="true">
                    {item.toUpperCase()}
                  </span>
                ) : (
                  <TrackedLink
                    key={item}
                    href={pathname}
                    locale={item}
                    label={item.toUpperCase()}
                    eventName="locale_switch"
                    payload={{ from: locale, to: item, pathname, surface: "mobile" }}
                    className="rounded px-1.5 py-1 text-slate-300 transition hover:bg-white/8 hover:text-white"
                  />
                ),
              )}
            </div>
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <TrackedLink
                  key={link.href}
                  href={link.href}
                  label={tNav(link.labelKey)}
                  eventName="nav_click"
                  payload={{ href: link.href }}
                  onClick={() => setIsMobileMenuOpen(false)}
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
