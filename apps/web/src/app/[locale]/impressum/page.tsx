import type { Metadata } from "next";
import { buildLocalizedMetadata } from "@/lib/seo";

type ImprintPageProps = {
  params: Promise<{ locale: "de" | "en" }>;
};

export async function generateMetadata({ params }: ImprintPageProps): Promise<Metadata> {
  const { locale } = await params;

  return buildLocalizedMetadata({
    locale,
    pathname: "/impressum",
    title: locale === "en" ? "Imprint" : "Impressum",
    description:
      locale === "en"
        ? "Provider identification for the System GraphRAG Lab project."
        : "Anbieterkennzeichnung für das Projekt System GraphRAG Lab.",
  });
}

export default async function ImpressumPage({ params }: ImprintPageProps): Promise<React.JSX.Element> {
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
            {isEn ? "Imprint" : "Impressum"}
          </h1>
          <p className="max-w-3xl text-slate-700">
            {isEn
              ? "Provider identification for System GraphRAG Lab."
              : "Angaben zur Anbieterkennzeichnung für System GraphRAG Lab."}
          </p>
        </header>
        <div className="space-y-6 text-slate-700">
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-900">{isEn ? "1. Provider" : "1. Anbieter"}</h2>
            <p>Michael Meierhoff</p>
          </section>
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-900">{isEn ? "2. Contact" : "2. Kontakt"}</h2>
            <p>LinkedIn: michael-meierhoff-b5426458</p>
            <p>GitHub: mimeonline</p>
          </section>
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-900">{isEn ? "3. Liability notice" : "3. Haftung für Inhalte"}</h2>
            <p>
              {isEn
                ? "Content was created with due care. However, no guarantee is given for accuracy, completeness, or timeliness."
                : "Die Inhalte wurden mit Sorgfalt erstellt. Für Richtigkeit, Vollständigkeit und Aktualität wird jedoch keine Gewähr übernommen."}
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
