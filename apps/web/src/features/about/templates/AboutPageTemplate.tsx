import { TrackedLink } from "@/components/molecules/tracked-link";
import { TrackedPageView } from "@/components/molecules/tracked-page-view";
import { SiteFooter } from "@/components/organisms/site-footer";
import { SiteHeader } from "@/components/organisms/site-header";
import { PROJECT_INQUIRY_URL } from "@/config/site";
import { Blocks, ShieldCheck, Target } from "lucide-react";

export function AboutPageTemplate(): React.JSX.Element {
  return (
    <div className="flex min-h-screen flex-col bg-transparent text-slate-900">
      <TrackedPageView page="/about" />
      <SiteHeader />

      <main className="flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto w-full max-w-295 space-y-8">
          <section className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">About</p>
            <h1 className="max-w-[24ch] text-[2.1rem] font-bold tracking-tight text-slate-950 sm:text-[2.7rem]">
              System GraphRAG Lab
            </h1>
            <p className="max-w-[85ch] text-[1.05rem] leading-relaxed text-slate-700">
              System GraphRAG Lab ist ein öffentliches Architekturprojekt für den produktiven Einsatz von KI in
              Organisationen. Der Fokus liegt nicht auf besser formulierten Antworten, sondern auf belastbaren
              Entscheidungswegen.
            </p>
            <p className="max-w-[85ch] text-[1.05rem] leading-relaxed text-slate-700">
              Die zentrale Frage ist, wie aus Modellausgaben nachvollziehbare, prüfbare und integrierbare
              Entscheidungen entstehen.
            </p>
          </section>

          <section className="grid gap-5 sm:grid-cols-3">
            <article className="group glass-panel rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-900/5">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100/50 text-sky-600">
                <Target className="h-5 w-5" aria-hidden />
              </div>
              <h2 className="text-base font-semibold text-slate-900">Wozu</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                Viele KI Initiativen liefern schnell sichtbare Ergebnisse, scheitern aber bei Reproduzierbarkeit,
                Governance und Betriebsfähigkeit. Dieses Lab zeigt einen Ansatz, bei dem Kontext, Belege und Ableitung
                als Architektur behandelt werden.
              </p>
            </article>
            <article className="group glass-panel rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-900/5">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100/50 text-indigo-600">
                <ShieldCheck className="h-5 w-5" aria-hidden />
              </div>
              <h2 className="text-base font-semibold text-slate-900">Für wen</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                Für Verantwortliche aus Architektur, Produkt und Governance, die KI nicht nur testen, sondern
                verlässlich betreiben wollen. Im Mittelpunkt stehen Entscheidungsqualität, Verantwortbarkeit und
                Anschlussfähigkeit an bestehende Systemlandschaften.
              </p>
            </article>
            <article className="group glass-panel rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-900/5">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100/50 text-teal-600">
                <Blocks className="h-5 w-5" aria-hidden />
              </div>
              <h2 className="text-base font-semibold text-slate-900">Wie</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                Über Demo, Story und Essays in einer gemeinsamen Logik. Welche Frage wird beantwortet, welcher Kontext
                ist relevant, welche Belege tragen die Aussage und wie wird daraus eine operative Entscheidung.
              </p>
            </article>
          </section>

          <section className="glass-panel rounded-2xl border border-slate-200/70 p-6 sm:p-7">
            <h2 className="text-lg font-semibold text-slate-900">Über mich</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              Ich bin Michael Meierhoff, Independent Software und Systems Architect aus Hamburg. Seit über 20 Jahren
              arbeite ich in der IT mit Schwerpunkten in Systemdesign, Komplexitätsreduktion und Architektur
              Governance.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">
              Mein Hintergrund reicht von Softwareentwicklung bis zu Enterprise Architektur in internationalen
              Organisationen.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">
              System GraphRAG Lab ist als Arbeitsreferenz aufgebaut. Es macht transparent, wie KI in reale
              Architekturentscheidungen eingebettet werden kann, fachlich, technisch und organisatorisch.
            </p>
            <p className="mt-3 rounded-xl border border-sky-200/70 bg-sky-50/70 px-4 py-3 text-sm font-medium leading-relaxed text-slate-800">
              Leitlinie: weniger Hype, mehr belastbare Struktur für Entscheidungen.
            </p>
          </section>

          <section className="glass-panel rounded-2xl border border-slate-200/70 p-6 sm:p-7">
            <h2 className="text-lg font-semibold text-slate-900">Projektstatus</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              Das Projekt ist als Public MVP im Aufbau und wird iterativ erweitert. Der Anspruch ist ein klarer,
              überprüfbarer Architekturrahmen für KI Systeme mit Fokus auf Nachvollziehbarkeit, Governance und
              Integrationsfähigkeit.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <TrackedLink
                href="https://github.com/mimeonline"
                label="GitHub Profil"
                eventName="about_click"
                payload={{ target: "github" }}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                external
              />
              <TrackedLink
                href="https://www.linkedin.com/in/michael-meierhoff-b5426458/"
                label="LinkedIn Profil"
                eventName="about_click"
                payload={{ target: "linkedin" }}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                external
              />
              <TrackedLink
                href={PROJECT_INQUIRY_URL}
                label="Projekt anfragen"
                eventName="about_click"
                payload={{ target: "project_inquiry" }}
                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
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
