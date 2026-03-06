import { TrackedLink } from "@/components/molecules/tracked-link";
import { TrackedPageView } from "@/components/molecules/tracked-page-view";
import { SiteFooter } from "@/components/organisms/site-footer";
import { SiteHeader } from "@/components/organisms/site-header";
import { Blocks, ShieldCheck, Target } from "lucide-react";

type AboutPageTemplateProps = {
  locale: "de" | "en";
};

export async function AboutPageTemplate({
  locale,
}: AboutPageTemplateProps): Promise<React.JSX.Element> {
  const copy =
    locale === "en"
      ? {
          eyebrow: "About",
          intro1:
            "System GraphRAG Lab is a public architecture project for productive AI usage in organizations. The focus is not on better phrasing, but on reliable decision paths.",
          intro2:
            "The central question is how model outputs become traceable, reviewable, and integrable decisions.",
          whyTitle: "Why",
          whyBody:
            "Many AI initiatives produce visible results quickly but fail on reproducibility, governance, and operational fitness. This lab demonstrates an approach where context, evidence, and reasoning are treated as architecture.",
          whoTitle: "Who for",
          whoBody:
            "For people responsible across architecture, product, and governance who want to operate AI reliably instead of only testing it. The focus is on decision quality, accountability, and compatibility with existing system landscapes.",
          howTitle: "How",
          howBody:
            "Through demo, story, and essays in one shared logic. Which question is answered, which context matters, which evidence supports the statement, and how this becomes an operational decision.",
          aboutMeTitle: "About me",
          aboutMe1:
            "I am Michael Meierhoff, an independent software and systems architect from Hamburg. I have worked in IT for more than 20 years with a focus on system design, complexity reduction, and architecture governance.",
          aboutMe2:
            "My background ranges from software engineering to enterprise architecture in international organizations.",
          aboutMe3:
            "System GraphRAG Lab is built as a working reference. It makes transparent how AI can be embedded into real architectural decisions across business, technology, and organization.",
          guideline: "Guiding principle: less hype, more resilient structure for decisions.",
          statusTitle: "Project status",
          statusBody:
            "The project is being built as a public MVP and extended iteratively. The goal is a clear, testable architecture frame for AI systems with a focus on traceability, governance, and integration fitness.",
          github: "GitHub profile",
          linkedin: "LinkedIn profile",
        }
      : {
          eyebrow: "About",
          intro1:
            "System GraphRAG Lab ist ein öffentliches Architekturprojekt für den produktiven Einsatz von KI in Organisationen. Der Fokus liegt nicht auf besser formulierten Antworten, sondern auf belastbaren Entscheidungswegen.",
          intro2:
            "Die zentrale Frage ist, wie aus Modellausgaben nachvollziehbare, prüfbare und integrierbare Entscheidungen entstehen.",
          whyTitle: "Wozu",
          whyBody:
            "Viele KI Initiativen liefern schnell sichtbare Ergebnisse, scheitern aber bei Reproduzierbarkeit, Governance und Betriebsfähigkeit. Dieses Lab zeigt einen Ansatz, bei dem Kontext, Belege und Ableitung als Architektur behandelt werden.",
          whoTitle: "Für wen",
          whoBody:
            "Für Verantwortliche aus Architektur, Produkt und Governance, die KI nicht nur testen, sondern verlässlich betreiben wollen. Im Mittelpunkt stehen Entscheidungsqualität, Verantwortbarkeit und Anschlussfähigkeit an bestehende Systemlandschaften.",
          howTitle: "Wie",
          howBody:
            "Über Demo, Story und Essays in einer gemeinsamen Logik. Welche Frage wird beantwortet, welcher Kontext ist relevant, welche Belege tragen die Aussage und wie wird daraus eine operative Entscheidung.",
          aboutMeTitle: "Über mich",
          aboutMe1:
            "Ich bin Michael Meierhoff, Independent Software und Systems Architect aus Hamburg. Seit über 20 Jahren arbeite ich in der IT mit Schwerpunkten in Systemdesign, Komplexitätsreduktion und Architektur Governance.",
          aboutMe2:
            "Mein Hintergrund reicht von Softwareentwicklung bis zu Enterprise Architektur in internationalen Organisationen.",
          aboutMe3:
            "System GraphRAG Lab ist als Arbeitsreferenz aufgebaut. Es macht transparent, wie KI in reale Architekturentscheidungen eingebettet werden kann, fachlich, technisch und organisatorisch.",
          guideline: "Leitlinie: weniger Hype, mehr belastbare Struktur für Entscheidungen.",
          statusTitle: "Projektstatus",
          statusBody:
            "Das Projekt ist als Public MVP im Aufbau und wird iterativ erweitert. Der Anspruch ist ein klarer, überprüfbarer Architekturrahmen für KI Systeme mit Fokus auf Nachvollziehbarkeit, Governance und Integrationsfähigkeit.",
          github: "GitHub Profil",
          linkedin: "LinkedIn Profil",
        };

  return (
    <div className="flex min-h-screen flex-col bg-transparent text-slate-900">
      <TrackedPageView page="/about" />
      <SiteHeader />

      <main className="flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto w-full max-w-295 space-y-8">
          <section className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">{copy.eyebrow}</p>
            <h1 className="headline-wrap max-w-[24ch] text-[2.1rem] font-bold tracking-tight text-slate-950 sm:text-[2.7rem]">
              System GraphRAG Lab
            </h1>
            <p className="max-w-[85ch] text-[1.05rem] leading-relaxed text-slate-700">
              {copy.intro1}
            </p>
            <p className="max-w-[85ch] text-[1.05rem] leading-relaxed text-slate-700">
              {copy.intro2}
            </p>
          </section>

          <section className="grid gap-5 sm:grid-cols-3">
            <article className="group glass-panel rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-900/5">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100/50 text-sky-600">
                <Target className="h-5 w-5" aria-hidden />
              </div>
              <h2 className="text-base font-semibold text-slate-900">{copy.whyTitle}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">{copy.whyBody}</p>
            </article>
            <article className="group glass-panel rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-900/5">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100/50 text-indigo-600">
                <ShieldCheck className="h-5 w-5" aria-hidden />
              </div>
              <h2 className="text-base font-semibold text-slate-900">{copy.whoTitle}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">{copy.whoBody}</p>
            </article>
            <article className="group glass-panel rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-900/5">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100/50 text-teal-600">
                <Blocks className="h-5 w-5" aria-hidden />
              </div>
              <h2 className="text-base font-semibold text-slate-900">{copy.howTitle}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">{copy.howBody}</p>
            </article>
          </section>

          <section className="glass-panel rounded-2xl border border-slate-200/70 p-6 sm:p-7">
            <h2 className="text-lg font-semibold text-slate-900">{copy.aboutMeTitle}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">{copy.aboutMe1}</p>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">{copy.aboutMe2}</p>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">{copy.aboutMe3}</p>
            <p className="mt-3 rounded-xl border border-sky-200/70 bg-sky-50/70 px-4 py-3 text-sm font-medium leading-relaxed text-slate-800">
              {copy.guideline}
            </p>
          </section>

          <section className="glass-panel rounded-2xl border border-slate-200/70 p-6 sm:p-7">
            <h2 className="text-lg font-semibold text-slate-900">{copy.statusTitle}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">{copy.statusBody}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <TrackedLink
                href="https://github.com/mimeonline"
                label={copy.github}
                eventName="about_click"
                payload={{ target: "github" }}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                external
              />
              <TrackedLink
                href="https://www.linkedin.com/in/michael-meierhoff-b5426458/"
                label={copy.linkedin}
                eventName="about_click"
                payload={{ target: "linkedin" }}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                external
              />
            </div>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
