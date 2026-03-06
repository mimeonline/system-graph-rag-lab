import type { Metadata } from "next";
import { buildLocalizedMetadata } from "@/lib/seo";
import { LegalPageTemplate } from "@/features/legal/templates/LegalPageTemplate";

type ImprintPageProps = {
  params: Promise<{ locale: "de" | "en" }>;
};

export async function generateMetadata({ params }: ImprintPageProps): Promise<Metadata> {
  const { locale } = await params;

  return buildLocalizedMetadata({
    locale,
    pathname: "/impressum",
    title: locale === "en" ? "Legal Notice" : "Impressum",
    description:
      locale === "en"
        ? "Provider identification details for System GraphRAG Lab."
        : "Anbieterkennzeichnung für das Projekt System GraphRAG Lab.",
  });
}

export default async function ImpressumPage({ params }: ImprintPageProps): Promise<React.JSX.Element> {
  const { locale } = await params;
  const text =
    locale === "en"
      ? {
          badge: "Legal",
          title: "Legal Notice",
          intro: "Provider identification details for System GraphRAG Lab.",
          provider: "1. Provider",
          projectPage: "Project page:",
          contact: "2. Contact",
          contentLiability: "3. Liability for content",
          contentText:
            "The content of this website has been created with care. However, no guarantee is given for its correctness, completeness, or timeliness.",
          linkLiability: "4. Liability for links",
          linkText:
            "This website contains links to external third-party services. Their operators are solely responsible for that content.",
          copyright: "5. Copyright",
          copyrightText:
            "Original content on this website is subject to German copyright law. Use beyond the statutory limits requires prior permission.",
        }
      : {
          badge: "Rechtliches",
          title: "Impressum",
          intro: "Angaben zur Anbieterkennzeichnung für System GraphRAG Lab.",
          provider: "1. Anbieter",
          projectPage: "Projektseite:",
          contact: "2. Kontakt",
          contentLiability: "3. Haftung für Inhalte",
          contentText:
            "Die Inhalte dieser Website wurden mit Sorgfalt erstellt. Für Richtigkeit, Vollständigkeit und Aktualität wird jedoch keine Gewähr übernommen.",
          linkLiability: "4. Haftung für Links",
          linkText:
            "Diese Website enthält Links zu externen Angeboten Dritter. Für deren Inhalte sind ausschließlich die jeweiligen Betreiber verantwortlich.",
          copyright: "5. Urheberrecht",
          copyrightText:
            "Eigene Inhalte auf dieser Website unterliegen dem deutschen Urheberrecht. Nutzung außerhalb der gesetzlichen Grenzen bedarf der vorherigen Zustimmung.",
        };

  return (
    <LegalPageTemplate
      pagePath="/impressum"
      badge={text.badge}
      title={text.title}
      intro={text.intro}
    >
      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">{text.provider}</h2>
        <p>Michael Meierhoff</p>
        <p>
          {text.projectPage}{" "}
          <a href="https://meierhoff-systems.de" target="_blank" rel="noreferrer noopener" className="underline decoration-slate-300 underline-offset-2">
            meierhoff-systems.de
          </a>
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">{text.contact}</h2>
        <p>
          LinkedIn:{" "}
          <a href="https://www.linkedin.com/in/michael-meierhoff-b5426458/" target="_blank" rel="noreferrer noopener" className="underline decoration-slate-300 underline-offset-2">
            michael-meierhoff-b5426458
          </a>
        </p>
        <p>
          GitHub:{" "}
          <a href="https://github.com/mimeonline" target="_blank" rel="noreferrer noopener" className="underline decoration-slate-300 underline-offset-2">
            mimeonline
          </a>
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">{text.contentLiability}</h2>
        <p>{text.contentText}</p>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">{text.linkLiability}</h2>
        <p>{text.linkText}</p>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">{text.copyright}</h2>
        <p>{text.copyrightText}</p>
      </section>
    </LegalPageTemplate>
  );
}
