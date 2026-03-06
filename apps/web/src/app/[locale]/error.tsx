"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps): React.JSX.Element {
  const t = useTranslations("ErrorPage");

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-4xl flex-col items-start justify-center gap-5 px-4 py-16 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">{t("eyebrow")}</p>
      <h1 className="text-4xl font-bold tracking-tight text-slate-950">{t("title")}</h1>
      <p className="max-w-2xl text-base leading-7 text-slate-700">{t("description")}</p>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white"
        >
          {t("retry")}
        </button>
        <Link href="/" className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700">
          {t("home")}
        </Link>
        <Link href="/essay" className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700">
          {t("browse")}
        </Link>
      </div>
      <div className="space-y-2 text-sm text-slate-600">
        <p className="font-semibold text-slate-900">{t("hintsTitle")}</p>
        <p>{t("hint1")}</p>
        <p>{t("hint2")}</p>
        <p>{error.digest ? t("hint3WithDigest", { digest: error.digest }) : t("hint3")}</p>
      </div>
    </main>
  );
}
