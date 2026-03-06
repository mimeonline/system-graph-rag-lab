import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { defaultLocale, locales, type AppLocale } from "@/i18n/config";

function detectLocale(acceptLanguage: string | null): AppLocale {
  if (!acceptLanguage) {
    return defaultLocale;
  }

  const normalized = acceptLanguage.toLowerCase();
  if (normalized.includes("en")) {
    return "en";
  }
  if (normalized.includes("de")) {
    return "de";
  }

  return defaultLocale;
}

export default async function RootRedirectPage(): Promise<never> {
  const requestHeaders = await headers();
  const locale = detectLocale(requestHeaders.get("accept-language"));
  const targetLocale = locales.includes(locale) ? locale : defaultLocale;

  redirect(`/${targetLocale}`);
}
