import type { Metadata } from "next";
import { withCanonical } from "@/config/site";
import { LegalPageTemplate } from "@/features/legal/templates/LegalPageTemplate";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Anbieterkennzeichnung für das Projekt System GraphRAG Lab.",
  alternates: {
    canonical: withCanonical("/impressum"),
  },
  openGraph: {
    title: "Impressum",
    description: "Anbieterkennzeichnung für das Projekt System GraphRAG Lab.",
    url: withCanonical("/impressum"),
    type: "website",
  },
};

export default function ImpressumPage(): React.JSX.Element {
  return (
    <LegalPageTemplate
      pagePath="/impressum"
      badge="Rechtliches"
      title="Impressum"
      intro="Angaben zur Anbieterkennzeichnung für System GraphRAG Lab."
    >
      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">1. Anbieter</h2>
        <p>Michael Meierhoff</p>
        <p>
          Projektseite:{" "}
          <a className="font-medium text-sky-700 underline underline-offset-2" href="https://meierhoff-systemde.de" target="_blank" rel="noreferrer noopener">
            meierhoff-systemde.de
          </a>{" "}
          (im Aufbau)
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">2. Kontakt</h2>
        <p>
          LinkedIn:{" "}
          <a
            className="font-medium text-sky-700 underline underline-offset-2"
            href="https://www.linkedin.com/in/michael-meierhoff-b5426458/"
            target="_blank"
            rel="noreferrer noopener"
          >
            michael-meierhoff-b5426458
          </a>
        </p>
        <p>
          GitHub:{" "}
          <a className="font-medium text-sky-700 underline underline-offset-2" href="https://github.com/mimeonline" target="_blank" rel="noreferrer noopener">
            mimeonline
          </a>
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">3. Haftung für Inhalte</h2>
        <p>
          Die Inhalte wurden mit Sorgfalt erstellt. Für Richtigkeit, Vollständigkeit und Aktualität wird jedoch keine
          Gewähr übernommen.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">4. Haftung für Links</h2>
        <p>
          Diese Website enthält Links zu externen Angeboten Dritter. Für deren Inhalte sind ausschließlich die jeweiligen
          Betreiber verantwortlich.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">5. Urheberrecht</h2>
        <p>
          Eigene Inhalte auf dieser Website unterliegen dem deutschen Urheberrecht. Nutzung außerhalb der gesetzlichen
          Grenzen bedarf der vorherigen Zustimmung.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">6. Hinweis</h2>
        <p>
          Für eine öffentliche Liveschaltung sollten die rechtlich erforderlichen Detailangaben (z. B. ladungsfähige
          Anschrift) vollständig ergänzt werden.
        </p>
      </section>
    </LegalPageTemplate>
  );
}
