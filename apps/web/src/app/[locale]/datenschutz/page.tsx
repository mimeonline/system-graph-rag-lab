import type { Metadata } from "next";
import { buildLocalizedMetadata } from "@/lib/seo";

type PrivacyPageProps = {
  params: Promise<{ locale: "de" | "en" }>;
};

export async function generateMetadata({ params }: PrivacyPageProps): Promise<Metadata> {
  const { locale } = await params;

  return buildLocalizedMetadata({
    locale,
    pathname: "/datenschutz",
    title: locale === "en" ? "Privacy" : "Datenschutz",
    description:
      locale === "en"
        ? "Privacy notice for the System GraphRAG Lab project."
        : "Datenschutzhinweise für das Projekt System GraphRAG Lab.",
  });
}

export default async function DatenschutzPage({ params }: PrivacyPageProps): Promise<React.JSX.Element> {
  const { locale } = await params;
  const isEn = locale === "en";

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="space-y-8 rounded-3xl border border-slate-200/70 bg-white/80 p-6 sm:p-10">
        <header className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">
            {isEn ? "Legal" : "Rechtliches"}
          </p>
          <h1 className="text-[2rem] font-bold tracking-tight text-slate-950 sm:text-[2.6rem]">
            {isEn ? "Privacy" : "Datenschutz"}
          </h1>
          <p className="max-w-3xl text-slate-700">
            {isEn
              ? "This page describes which data may be processed when visiting System GraphRAG Lab and for what purpose."
              : "Diese Seite beschreibt, welche Daten beim Besuch von System GraphRAG Lab verarbeitet werden und zu welchem Zweck."}
          </p>
        </header>
        <div className="space-y-6 text-slate-700">
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-900">{isEn ? "1. Responsible party" : "1. Verantwortlich"}</h2>
            <p>Michael Meierhoff</p>
          </section>
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-900">{isEn ? "2. Access data" : "2. Zugriffsdaten"}</h2>
            <p>
              {isEn
                ? "When calling this website, technically required data may be processed, for example IP address, timestamp, requested URL, browser type, and operating system."
                : "Beim Aufruf der Website können technisch erforderliche Daten verarbeitet werden, z. B. IP-Adresse, Zeitpunkt, aufgerufene URL, Browser-Typ und Betriebssystem."}
            </p>
          </section>
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-900">{isEn ? "3. External links" : "3. Kommunikation über externe Links"}</h2>
            <p>
              {isEn
                ? "This website links to external services such as GitHub and LinkedIn. Their privacy policies apply when switching to those services."
                : "Diese Website verlinkt auf externe Dienste (z. B. GitHub und LinkedIn). Beim Wechsel dorthin gelten die Datenschutzbestimmungen der jeweiligen Anbieter."}
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
