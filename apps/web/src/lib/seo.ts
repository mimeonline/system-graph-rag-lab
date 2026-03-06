import type { Metadata } from "next";
import { SITE } from "@/config/site";
import { defaultLocale, locales, type AppLocale } from "@/i18n/config";

function normalizePathname(pathname: string): string {
  if (!pathname || pathname === "/") {
    return "";
  }

  return pathname.startsWith("/") ? pathname : `/${pathname}`;
}

export function getAbsoluteUrl(pathname: string): string {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${SITE.url}${normalized}`;
}

export function buildLocalizedPath(locale: AppLocale, pathname = ""): string {
  return `/${locale}${normalizePathname(pathname)}`;
}

export function buildLanguageAlternates(
  pathname: string,
  availableLocales: AppLocale[] = [...locales],
): Record<AppLocale, string> {
  return Object.fromEntries(
    availableLocales.map((locale) => [locale, buildLocalizedPath(locale, pathname)]),
  ) as Record<AppLocale, string>;
}

type LocalizedMetadataInput = {
  locale: AppLocale;
  pathname?: string;
  title: string;
  description: string;
  availableLocales?: AppLocale[];
  canonicalLocale?: AppLocale;
  noindex?: boolean;
  openGraphType?: "website" | "article";
};

export function buildLocalizedMetadata({
  locale,
  pathname = "",
  title,
  description,
  availableLocales = [...locales],
  canonicalLocale = locale,
  noindex = false,
  openGraphType = "website",
}: LocalizedMetadataInput): Metadata {
  const canonicalPath = buildLocalizedPath(canonicalLocale, pathname);

  return {
    title,
    description,
    metadataBase: new URL(SITE.url),
    alternates: {
      canonical: canonicalPath,
      languages: {
        ...buildLanguageAlternates(pathname, availableLocales),
        "x-default": buildLocalizedPath(defaultLocale, pathname),
      },
    },
    robots: noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      title,
      description,
      url: canonicalPath,
      type: openGraphType,
      siteName: SITE.name,
      locale: locale === "de" ? "de_DE" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
