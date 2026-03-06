import type { Metadata } from "next";
import { buildLocalizedMetadata } from "@/lib/seo";
import { LegalPageTemplate } from "@/features/legal/templates/LegalPageTemplate";

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
  const text = isEn
    ? {
        badge: "Privacy",
        title: "Privacy",
        intro:
          "This page describes which data may be processed when visiting System GraphRAG Lab and for what purpose.",
        controller: "1. Controller",
        projectContact: "Project contact:",
        accessData: "2. Access data",
        accessText1:
          "When visiting the website, technically necessary data may be processed, such as IP address, timestamp, requested URL, browser type, and operating system.",
        accessText2:
          "This processing is used for secure operation, content delivery, and error analysis.",
        analytics: "3. Reach measurement with Rybbit",
        analyticsText1:
          "Rybbit is used via the hosted endpoint stats.meierhoff-systems.de for anonymized reach measurement. In the current configuration, no tracking cookies are set on end devices.",
        analyticsText2:
          "Based on the current setup, this fully cookieless measurement does not require a cookie consent layer.",
        localePref: "4. Language preference",
        localeText1:
          "To support switching between the German and English interface, a language preference can be stored. This setting is used solely to provide your chosen language consistently across page visits.",
        localeText2:
          "This language cookie is not used for tracking or marketing purposes.",
        externalLinks: "5. External links",
        externalText:
          "This website links to external services such as GitHub and LinkedIn. When leaving this site, the privacy policies of the respective providers apply.",
        retention: "6. Retention period",
        retentionText:
          "Log data is stored only as long as necessary for operations, security, and technical diagnostics.",
        rights: "7. Rights of data subjects",
        rightsText:
          "Under the GDPR, you have rights in particular to access, rectification, deletion, restriction of processing, and objection to the processing of your personal data.",
      }
    : {
        badge: "Datenschutz",
        title: "Datenschutz",
        intro:
          "Diese Seite beschreibt, welche Daten beim Besuch von System GraphRAG Lab verarbeitet werden und zu welchem Zweck.",
        controller: "1. Verantwortlich",
        projectContact: "Projektkontakt:",
        accessData: "2. Zugriffsdaten",
        accessText1:
          "Beim Aufruf der Website können technisch erforderliche Daten verarbeitet werden, z. B. IP-Adresse, Zeitpunkt, aufgerufene URL, Browser-Typ und Betriebssystem.",
        accessText2:
          "Diese Verarbeitung dient dem sicheren Betrieb, der Auslieferung der Inhalte und der Fehleranalyse.",
        analytics: "3. Reichweitenmessung mit Rybbit",
        analyticsText1:
          "Zur anonymisierten Reichweitenmessung wird Rybbit über den gehosteten Endpunkt stats.meierhoff-systems.de eingesetzt. In der aktuellen Konfiguration werden dabei keine Tracking-Cookies auf Endgeräten gesetzt.",
        analyticsText2:
          "Für diese rein cookielose Messung ist daher nach aktuellem Stand kein Cookie-Consent-Layer erforderlich.",
        localePref: "4. Sprachpräferenz",
        localeText1:
          "Für die Auswahl zwischen deutscher und englischer Oberfläche kann eine Sprachpräferenz gespeichert werden. Diese Einstellung dient ausschließlich dazu, die gewünschte Sprache über Seitenaufrufe hinweg konsistent bereitzustellen.",
        localeText2:
          "Dieser Sprach-Cookie wird nicht zu Tracking- oder Marketingzwecken verwendet.",
        externalLinks: "5. Externe Links",
        externalText:
          "Diese Website verlinkt auf externe Dienste (z. B. GitHub und LinkedIn). Beim Wechsel dorthin gelten die Datenschutzbestimmungen der jeweiligen Anbieter.",
        retention: "6. Speicherdauer",
        retentionText:
          "Protokolldaten werden nur so lange gespeichert, wie es für Betrieb, Sicherheit und technische Diagnose erforderlich ist.",
        rights: "7. Rechte der betroffenen Personen",
        rightsText:
          "Du hast nach DSGVO insbesondere das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung sowie Widerspruch gegen die Verarbeitung deiner personenbezogenen Daten.",
      };

  return (
    <LegalPageTemplate
      pagePath="/datenschutz"
      badge={text.badge}
      title={text.title}
      intro={text.intro}
    >
      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">{text.controller}</h2>
        <p>Michael Meierhoff</p>
        <p>
          {text.projectContact}{" "}
          <a href="https://meierhoff-systems.de" target="_blank" rel="noreferrer noopener" className="underline decoration-slate-300 underline-offset-2">
            meierhoff-systems.de
          </a>
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">{text.accessData}</h2>
        <p>{text.accessText1}</p>
        <p>{text.accessText2}</p>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">{text.analytics}</h2>
        <p>{text.analyticsText1}</p>
        <p>{text.analyticsText2}</p>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">{text.localePref}</h2>
        <p>{text.localeText1}</p>
        <p>{text.localeText2}</p>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">{text.externalLinks}</h2>
        <p>{text.externalText}</p>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">{text.retention}</h2>
        <p>{text.retentionText}</p>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">{text.rights}</h2>
        <p>{text.rightsText}</p>
      </section>
    </LegalPageTemplate>
  );
}
