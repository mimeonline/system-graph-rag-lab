"use client";

import { StatusPageShell } from "@/components/organisms/status-page-shell";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps): React.JSX.Element {
  const t = useTranslations("ErrorPage");

  return (
    <StatusPageShell
      code="500"
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("description")}
      summary={t("summary")}
      statusLabel={t("statusLabel")}
      recoveryTitle={t("recoveryTitle")}
      recoveryDescription={t("recoveryDescription")}
      primaryAction={
        <button
          type="button"
          onClick={reset}
          className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-sky-700"
        >
          {t("retry")}
        </button>
      }
      secondaryActions={[
        <Link key="home" href="/" className="rounded-xl border border-slate-300 bg-white/90 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-400 hover:bg-white">
          {t("home")}
        </Link>,
        <Link key="essay" href="/essay" className="rounded-xl border border-slate-300 bg-white/90 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-400 hover:bg-white">
          {t("browse")}
        </Link>,
      ]}
      checklistTitle={t("hintsTitle")}
      checklistItems={[t("hint1"), t("hint2"), error.digest ? t("hint3WithDigest", { digest: error.digest }) : t("hint3")]}
      routesTitle={t("routesTitle")}
      routeLinks={[
        { href: "/", label: t("routeHomeTitle"), description: t("routeHomeDescription") },
        { href: "/demo", label: t("routeDemoTitle"), description: t("routeDemoDescription") },
        { href: "/story/graphrag", label: t("routeStoryTitle"), description: t("routeStoryDescription") },
        { href: "/essay", label: t("routeEssayTitle"), description: t("routeEssayDescription") },
      ]}
    />
  );
}
