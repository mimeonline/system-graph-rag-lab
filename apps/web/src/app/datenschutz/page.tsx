import type { Metadata } from "next";
import { withCanonical } from "@/config/site";
import { LegalPageTemplate } from "@/features/legal/templates/LegalPageTemplate";

export const metadata: Metadata = {
  title: "Datenschutz",
  description: "Datenschutzhinweise für das Projekt System GraphRAG Lab.",
  alternates: {
    canonical: withCanonical("/datenschutz"),
  },
  openGraph: {
    title: "Datenschutz",
    description: "Datenschutzhinweise für das Projekt System GraphRAG Lab.",
    url: withCanonical("/datenschutz"),
    type: "website",
  },
};

export default function DatenschutzPage(): React.JSX.Element {
  return (
    <LegalPageTemplate
      pagePath="/datenschutz"
      badge="Rechtliches"
      title="Datenschutz"
      intro="Diese Seite beschreibt, welche Daten beim Besuch von System GraphRAG Lab verarbeitet werden und zu welchem Zweck."
    >
      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">1. Verantwortlich</h2>
        <p>Michael Meierhoff</p>
        <p>
          Projektkontakt:{" "}
          <a className="font-medium text-sky-700 underline underline-offset-2" href="https://meierhoff-systemde.de" target="_blank" rel="noreferrer noopener">
            meierhoff-systemde.de
          </a>{" "}
          (im Aufbau)
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">2. Zugriffsdaten</h2>
        <p>
          Beim Aufruf der Website können technisch erforderliche Daten verarbeitet werden, z. B. IP-Adresse, Zeitpunkt,
          aufgerufene URL, Browser-Typ und Betriebssystem.
        </p>
        <p>Diese Verarbeitung dient dem sicheren Betrieb, der Auslieferung der Inhalte und der Fehleranalyse.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">3. Kommunikation über externe Links</h2>
        <p>
          Diese Website verlinkt auf externe Dienste (z. B. GitHub und LinkedIn). Beim Wechsel dorthin gelten die
          Datenschutzbestimmungen der jeweiligen Anbieter.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">4. Speicherdauer</h2>
        <p>
          Protokolldaten werden nur so lange gespeichert, wie es für Betrieb, Sicherheit und technische Diagnose
          erforderlich ist.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">5. Rechte der betroffenen Personen</h2>
        <p>
          Du hast nach DSGVO insbesondere das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung
          sowie Widerspruch gegen die Verarbeitung deiner personenbezogenen Daten.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">6. Stand</h2>
        <p>Diese Datenschutzhinweise werden mit dem Betriebsaufbau des Projekts weiter präzisiert und aktualisiert.</p>
      </section>
    </LegalPageTemplate>
  );
}
