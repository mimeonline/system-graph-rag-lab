"use client";

import { useMemo, useState } from "react";
import { NextIntlClientProvider } from "next-intl";
import { StatusPageShell } from "@/components/organisms/status-page-shell";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/config";
import deMessages from "../../messages/de.json";
import enMessages from "../../messages/en.json";
import "./globals.css";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

function getLocaleFromPathname(pathname: string): AppLocale {
  return pathname.startsWith("/en") ? "en" : "de";
}

export default function GlobalError({ error, reset }: GlobalErrorProps): React.JSX.Element {
  const [locale] = useState<AppLocale>(() =>
    typeof window === "undefined" ? "de" : getLocaleFromPathname(window.location.pathname),
  );

  const messages = locale === "en" ? enMessages : deMessages;
  const copy = useMemo(() => messages.ErrorPage, [messages]);

  return (
    <html lang={locale}>
      <body className="antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <StatusPageShell
            code="500"
            eyebrow={copy.eyebrow}
            title={copy.title}
            description={copy.description}
            summary={copy.summary}
            statusLabel={copy.statusLabel}
            recoveryTitle={copy.recoveryTitle}
            recoveryDescription={copy.recoveryDescription}
            primaryAction={
              <button
                type="button"
                onClick={reset}
                className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-sky-700"
              >
                {copy.retry}
              </button>
            }
            secondaryActions={[
              <Link key="home" href="/" className="rounded-xl border border-slate-300 bg-white/90 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-400 hover:bg-white">
                {copy.home}
              </Link>,
              <Link key="essay" href="/essay" className="rounded-xl border border-slate-300 bg-white/90 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-400 hover:bg-white">
                {copy.browse}
              </Link>,
            ]}
            checklistTitle={copy.hintsTitle}
            checklistItems={[copy.hint1, copy.hint2, error.digest ? copy.hint3WithDigest.replace("{digest}", error.digest) : copy.hint3]}
            routesTitle={copy.routesTitle}
            routeLinks={[
              { href: "/", label: copy.routeHomeTitle, description: copy.routeHomeDescription },
              { href: "/demo", label: copy.routeDemoTitle, description: copy.routeDemoDescription },
              { href: "/story/graphrag", label: copy.routeStoryTitle, description: copy.routeStoryDescription },
              { href: "/essay", label: copy.routeEssayTitle, description: copy.routeEssayDescription },
            ]}
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
