"use client";

import { Menu, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { TrackedLink } from "@/components/molecules/tracked-link";
import { siteNavigation, type NavChild, type NavItem } from "@/components/organisms/siteNavigation";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import type { AppLocale } from "@/i18n/config";
import { usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";

function hrefPath(href: string): string {
  return href.split("?")[0] ?? href;
}

function isActivePath(pathname: string, href: string): boolean {
  const path = hrefPath(href);

  if (path === "/") {
    return pathname === path;
  }

  return pathname === path || pathname.startsWith(`${path}/`);
}

function navText(item: NavItem | NavChild, locale: AppLocale) {
  return item.text[locale] ?? item.text.de;
}

function primaryLinkClass(isActive: boolean): string {
  return cn(
    "inline-flex h-9 items-center justify-center gap-2 rounded-md px-3 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70",
    isActive ? "bg-white/20 text-white" : "text-slate-100 hover:bg-white/10 hover:text-white",
  );
}

function childLinkClass(isActive: boolean): string {
  return cn(
    "flex min-w-0 items-start gap-3 rounded-md px-3 py-2.5 text-left transition-colors",
    isActive ? "bg-white/15 text-white" : "text-slate-100 hover:bg-white/10 hover:text-white",
  );
}

function DesktopNavigationChild({
  child,
  locale,
  pathname,
}: {
  child: NavChild;
  locale: AppLocale;
  pathname: string;
}) {
  const Icon = child.icon;
  const text = navText(child, locale);
  const active = isActivePath(pathname, child.href);

  return (
    <NavigationMenuLink asChild>
      <TrackedLink
        aria-current={active ? "page" : undefined}
        href={child.href}
        label={text.label}
        eventName="nav_sub_click"
        payload={{ href: child.href, surface: "desktop" }}
        className={childLinkClass(active)}
      >
        <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        <span className="min-w-0">
          <span className="block text-sm font-semibold">{text.label}</span>
          <span className="mt-0.5 block text-xs leading-relaxed text-slate-300">{text.description}</span>
        </span>
      </TrackedLink>
    </NavigationMenuLink>
  );
}

function DesktopNavigationItem({
  item,
  locale,
  pathname,
}: {
  item: NavItem;
  locale: AppLocale;
  pathname: string;
}) {
  const Icon = item.icon;
  const text = navText(item, locale);
  const active = isActivePath(pathname, item.href);
  const hasChildren = Boolean(item.children?.length);

  if (!hasChildren) {
    return (
      <NavigationMenuItem>
        <NavigationMenuLink asChild>
          <TrackedLink
            aria-current={active ? "page" : undefined}
            href={item.href}
            label={text.label}
            eventName="nav_click"
            payload={{ href: item.href, surface: "desktop" }}
            className={primaryLinkClass(active)}
          >
            <Icon className="h-4 w-4" aria-hidden />
            {text.label}
          </TrackedLink>
        </NavigationMenuLink>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem>
      <div
        className={cn(
          "inline-flex items-center overflow-hidden rounded-md text-sm font-medium transition-colors",
          active ? "bg-white/20 text-white" : "text-slate-100 hover:bg-white/10 hover:text-white",
        )}
      >
        <NavigationMenuLink asChild>
          <TrackedLink
            aria-current={active ? "page" : undefined}
            href={item.href}
            label={text.label}
            eventName="nav_click"
            payload={{ href: item.href, surface: "desktop" }}
            className="inline-flex h-9 items-center gap-2 py-1.5 pl-3 pr-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
          >
            <Icon className="h-4 w-4" aria-hidden />
            {text.label}
          </TrackedLink>
        </NavigationMenuLink>
        <NavigationMenuTrigger
          aria-label={
            locale === "en" ? `${text.label} sections` : `${text.label} Unterbereiche anzeigen`
          }
          className={cn(
            "h-9 rounded-none px-1.5",
            active
              ? "text-white/80 hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white data-[state=open]:bg-white/10 data-[state=open]:text-white"
              : "text-slate-300",
          )}
          title={locale === "en" ? `${text.label} sections` : `${text.label} Unterbereiche anzeigen`}
        />
      </div>
      <NavigationMenuContent className="w-80">
        <div className="mb-1 rounded-md border border-white/10 bg-white/5 px-3 py-2">
          <p className="text-sm font-semibold text-white">{text.label}</p>
          <p className="mt-0.5 text-xs leading-relaxed text-slate-300">{text.description}</p>
        </div>
        <div className="grid gap-1">
          {item.children?.map((child) => (
            <DesktopNavigationChild key={child.href} child={child} locale={locale} pathname={pathname} />
          ))}
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}

function MobileNavigationChild({
  child,
  locale,
  pathname,
  onNavigate,
}: {
  child: NavChild;
  locale: AppLocale;
  pathname: string;
  onNavigate: () => void;
}) {
  const Icon = child.icon;
  const text = navText(child, locale);
  const active = isActivePath(pathname, child.href);

  return (
    <TrackedLink
      href={child.href}
      label={text.label}
      eventName="nav_sub_click"
      payload={{ href: child.href, surface: "mobile" }}
      onClick={onNavigate}
      className={childLinkClass(active)}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <span className="min-w-0">
        <span className="block text-sm font-medium">{text.label}</span>
        <span className="mt-0.5 block text-xs leading-relaxed text-slate-300">{text.description}</span>
      </span>
    </TrackedLink>
  );
}

export function SiteHeader(): React.JSX.Element {
  const tHeader = useTranslations("SiteHeader");
  const tLocale = useTranslations("LocaleSwitcher");
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const localeItems: AppLocale[] = ["de", "en"];
  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isMobileMenuOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-[#173663] bg-[#0c2345]/95 text-white backdrop-blur">
      <div className="mx-auto flex min-h-16 w-full max-w-[1180px] items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-2">
        <TrackedLink
          href="/"
          label="System GraphRAG Lab"
          eventName="nav_brand_click"
          payload={{ href: "/", surface: "header" }}
          className="min-w-0 flex items-center gap-2.5 text-white transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70 sm:gap-3"
        >
          <span className="truncate text-sm font-semibold tracking-[0.01em]">System GraphRAG Lab</span>
          <span className="hidden text-[11px] uppercase tracking-[0.16em] text-slate-300 sm:inline">
            {tHeader("productBadge")}
          </span>
        </TrackedLink>

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

          <nav className="hidden items-center gap-1.5 text-sm sm:flex" aria-label={tHeader("navigationLabel")}>
            <NavigationMenu className="contents" delayDuration={150} skipDelayDuration={250} viewport={false}>
              <NavigationMenuList>
                {siteNavigation.map((item) => (
                  <DesktopNavigationItem key={item.href} item={item} locale={locale} pathname={pathname} />
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          <div
            className="hidden items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-300 sm:inline-flex"
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
          <nav className="mx-auto grid w-full max-w-[1180px] gap-2 px-4 py-3" aria-label={tHeader("mobileNavigationLabel")}>
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
            {siteNavigation.map((item) => {
              const Icon = item.icon;
              const text = navText(item, locale);
              const active = isActivePath(pathname, item.href);

              return (
                <div key={item.href} className="grid gap-1">
                  <TrackedLink
                    href={item.href}
                    label={text.label}
                    eventName="nav_click"
                    payload={{ href: item.href, surface: "mobile" }}
                    onClick={closeMobileMenu}
                    className={cn(
                      "inline-flex min-h-11 items-start gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition",
                      active ? "bg-white/20 text-white" : "bg-white/5 text-slate-100 hover:bg-white/10",
                    )}
                  >
                    <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                    <span className="min-w-0">
                      <span className="block">{text.label}</span>
                      <span className={active ? "block text-xs text-white/75" : "block text-xs text-slate-300"}>
                        {text.description}
                      </span>
                    </span>
                  </TrackedLink>
                  {item.children ? (
                    <div className="grid gap-1 border-l border-white/10 pl-3">
                      {item.children.map((child) => (
                        <MobileNavigationChild
                          key={child.href}
                          child={child}
                          locale={locale}
                          pathname={pathname}
                          onNavigate={closeMobileMenu}
                        />
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
