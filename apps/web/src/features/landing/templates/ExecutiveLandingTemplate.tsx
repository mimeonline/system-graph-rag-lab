import { TrackedLink } from "@/components/molecules/tracked-link";
import { TrackedPageView } from "@/components/molecules/tracked-page-view";
import { SiteFooter } from "@/components/organisms/site-footer";
import { SiteHeader } from "@/components/organisms/site-header";
import { ExecutiveHeroGraph } from "@/features/landing/molecules/ExecutiveHeroGraph";
import { LandingReveal } from "@/features/landing/molecules/LandingReveal";

export function ExecutiveLandingTemplate(): React.JSX.Element {
  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900">
      <TrackedPageView page="/" />
      <SiteHeader />

      <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <div className="mx-auto w-full max-w-295 space-y-14">
          <LandingReveal>
            <section className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">
              Executive Landing
            </p>
            <div className="grid items-start gap-7 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
              <div className="min-w-0 space-y-5 text-left">
              <h1 className="max-w-[18ch] text-[2rem] font-semibold tracking-tight text-slate-950 sm:text-[2.45rem]">
                Nachvollziehbare KI Entscheidungen mit GraphRAG
              </h1>
              <p className="max-w-[70ch] text-[1rem] leading-7 text-slate-700">
                GraphRAG macht Herleitung prüfbar: Belege, Beziehungen und Ableitungspfad werden sichtbar
                und machen Entscheidungen belastbarer.
              </p>
              <p className="max-w-[70ch] text-xs font-medium uppercase tracking-[0.08em] text-slate-500">
                Vertrauen durch Nachvollziehbarkeit: Neo4j, kontrolliertes Retrieval, explizite Beziehungslogik.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <TrackedLink
                  href="/demo"
                  label="Demo starten"
                  eventName="landing_cta_click"
                  payload={{ target: "/demo", surface: "hero-primary" }}
                  className="inline-flex rounded-md bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700"
                />
                <TrackedLink
                  href="#rag-vs-graphrag"
                  label="RAG vs GraphRAG verstehen"
                  eventName="landing_cta_click"
                  payload={{
                    target: "#rag-vs-graphrag",
                    surface: "hero-secondary",
                  }}
                  className="inline-flex rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-700"
                />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-900">In 60 Sekunden prüfen:</p>
                <ul className="space-y-1.5 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-sky-600" />
                    <span>Welche Knoten wirklich im Kontext landen</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-sky-600" />
                    <span>Welche Belege die Antwort tragen</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-sky-600" />
                    <span>Wie stabil die Argumentation bei Nachfragen bleibt</span>
                  </li>
                </ul>
              </div>
              </div>

              <div className="w-full max-w-[560px] self-start justify-self-center rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-4 sm:p-5 lg:justify-self-end">
                <ExecutiveHeroGraph />
              </div>
            </div>
            </section>
          </LandingReveal>

          <LandingReveal>
            <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-gradient-to-b from-slate-100 to-slate-50 py-12 sm:py-14">
              <div className="mx-auto w-full max-w-295 space-y-5 px-4 sm:px-6">
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">Was Dich hier auf dieser Seite erwartet</h2>
                  <p className="max-w-[88ch] text-sm leading-7 text-slate-700">
                    Das hier ist ein Explorationsprojekt zu GraphRAG, das ich offen teile. Ziel war, GraphRAG nicht nur
                    theoretisch zu verstehen, sondern praktisch auszuprobieren: Was funktioniert wirklich, wo wird es
                    klarer und wo bleibt es anspruchsvoll?
                  </p>
                  <p className="max-w-[88ch] text-sm leading-7 text-slate-700">
                    Auf dieser Seite mache ich diese Erfahrung zugänglich: als Live-Demo, als visuelle Einordnung und
                    als Essays mit den wichtigsten Erkenntnissen aus Architektur-, Produkt- und Governance-Perspektive.
                    Du kannst direkt dort einsteigen, wo es für Dich gerade den meisten Wert hat.
                  </p>
                </div>

                <div className="grid gap-3.5 sm:grid-cols-3">
                  <TrackedLink
                    href="/demo"
                    label="Demo"
                    eventName="landing_section_click"
                    payload={{ target: "/demo", surface: "what-to-expect-demo" }}
                    className="group rounded-xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50/60"
                  >
                    <h3 className="text-sm font-semibold text-slate-900">Demo</h3>
                    <p className="mt-1.5 text-sm leading-6 text-slate-700">
                      Sieh live, wie aus Kontext und Belegen ein klarer Entscheidungsweg wird.
                    </p>
                  </TrackedLink>
                  <TrackedLink
                    href="/story/graphrag"
                    label="GraphRAG Story"
                    eventName="landing_section_click"
                    payload={{ target: "/story/graphrag", surface: "what-to-expect-story" }}
                    className="group rounded-xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50/60"
                  >
                    <h3 className="text-sm font-semibold text-slate-900">GraphRAG Story</h3>
                    <p className="mt-1.5 text-sm leading-6 text-slate-700">
                      Verstehe im direkten Vergleich, warum Struktur den Unterschied macht.
                    </p>
                  </TrackedLink>
                  <TrackedLink
                    href="/blog"
                    label="Graph Essays"
                    eventName="landing_section_click"
                    payload={{ target: "/blog", surface: "what-to-expect-essays" }}
                    className="group rounded-xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50/60"
                  >
                    <h3 className="text-sm font-semibold text-slate-900">Graph Essays</h3>
                    <p className="mt-1.5 text-sm leading-6 text-slate-700">
                      Vertiefe die Themen Qualität, Governance und System Thinking.
                    </p>
                  </TrackedLink>
                </div>

                <p className="text-sm text-slate-700">
                  Wenn Du es direkt erleben möchtest: Starte mit der Demo.
                </p>
              </div>
            </section>
          </LandingReveal>

          <LandingReveal>
            <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-white py-12 sm:py-14">
            <div className="mx-auto w-full max-w-295 space-y-5 px-4 sm:px-6">
              <div className="space-y-1.5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">SYSTEMISCHE GRENZE</p>
                <h2 className="text-lg font-semibold text-slate-900">
                  Warum reine LLM-Antworten für Entscheidungen nicht ausreichen
                </h2>
                <p className="text-sm text-slate-700">
                  LLM-Modelle liefern oft plausible Antworten.
                  Was fehlt, ist eine sichtbare Herleitung, die geprüft, hinterfragt und verteidigt werden kann.
                </p>
              </div>

              <div className="grid gap-3.5 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <h3 className="text-sm font-semibold text-slate-900">Nur LLM</h3>
                  <ul className="mt-2.5 space-y-1.5 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-400" />
                      <span>Argumentationspfad bleibt implizit</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-400" />
                      <span>Quellenbezug oft lose oder generisch</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-400" />
                      <span>Bei Nachfragen driftet die Begründung</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-400" />
                      <span>Entscheidungen beruhen auf Text, nicht auf Struktur</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-xl border border-slate-200 bg-sky-50 p-4">
                  <h3 className="text-sm font-semibold text-slate-900">Mit GraphRAG</h3>
                  <ul className="mt-2.5 space-y-1.5 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-sky-600" />
                      <span>Konzepte und Beziehungen sind explizit modelliert</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-sky-600" />
                      <span>Belegpfade sind nachvollziehbar</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-sky-600" />
                      <span>Anschlussfragen bleiben strukturell konsistent</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-sky-600" />
                      <span>Entscheidungen sind prüfbar statt nur plausibel</span>
                    </li>
                  </ul>
                </div>
              </div>

              <p className="text-sm text-slate-600">
                Für explorative Fragen reicht LLM-only oft aus. Für belastbare Architektur- oder
                Produktentscheidungen braucht es sichtbare Struktur.
              </p>
            </div>
            </section>
          </LandingReveal>

          <LandingReveal>
            <section
              id="rag-vs-graphrag"
              className="relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-gradient-to-b from-slate-100 to-slate-50 py-12 sm:py-14"
            >
            <div className="mx-auto w-full max-w-295 space-y-5 px-4 sm:px-6">
              <div className="space-y-1.5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-700">VERGLEICH</p>
                <h2 className="text-lg font-semibold text-slate-900">
                  RAG liefert Treffer. GraphRAG liefert Herleitung.
                </h2>
                <p className="text-sm text-slate-700">
                  Nicht mehr Kontext, sondern sichtbare Begründung: Konzepte, Belege und Ableitungspfad.
                </p>
              </div>
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50">
                    <tr className="text-slate-600">
                      <th className="px-4 py-2.5 font-semibold">Dimension</th>
                      <th className="px-4 py-2.5 font-semibold">RAG</th>
                      <th className="px-4 py-2.5 font-semibold">GraphRAG</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700">
                    <tr>
                      <td className="px-4 py-2.5 font-medium text-slate-900">
                        Auditierbarkeit
                      </td>
                      <td className="px-4 py-2.5"><span className="font-medium text-slate-900">Quellen oft lose</span>, Herleitung bleibt implizit</td>
                      <td className="px-4 py-2.5"><span className="font-medium text-slate-900">Belegpfade explizit</span>, Entscheidung prüfbar</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-medium text-slate-900">
                        Stabilität bei Nachfragen
                      </td>
                      <td className="px-4 py-2.5"><span className="font-medium text-slate-900">driftet häufiger</span> bei vernetzten Fragen</td>
                      <td className="px-4 py-2.5"><span className="font-medium text-slate-900">stabiler</span> durch strukturierte Beziehungen</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-medium text-slate-900">
                        Entscheidungsfähigkeit
                      </td>
                      <td className="px-4 py-2.5"><span className="font-medium text-slate-900">Antwort im Fließtext</span></td>
                      <td className="px-4 py-2.5"><span className="font-medium text-slate-900">Ableitung als Pfad</span>, leichter in Maßnahmen zu übersetzen</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="grid gap-3.5 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <h3 className="text-sm font-semibold text-slate-900">RAG reicht, wenn</h3>
                  <ul className="mt-2.5 space-y-1.5 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-400" />
                      <span>Fragen dokumentzentriert und linear sind</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-400" />
                      <span>Du vor allem Textstellen + Zusammenfassung brauchst</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-400" />
                      <span>Nachweis oder Audit keine harte Anforderung ist</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-xl border border-slate-200 bg-sky-50 p-4">
                  <h3 className="text-sm font-semibold text-slate-900">GraphRAG lohnt, wenn</h3>
                  <ul className="mt-2.5 space-y-1.5 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-sky-600" />
                      <span>Ursachenketten, Abhängigkeiten oder Trade-offs entscheidend sind</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-sky-600" />
                      <span>Stakeholder die Herleitung sehen und prüfen wollen</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-sky-600" />
                      <span>Anschlussfragen konsistent beantwortet werden müssen</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            </section>
          </LandingReveal>

          <LandingReveal>
            <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-white py-12 sm:py-14">
            <div className="mx-auto w-full max-w-295 px-4 sm:px-6">
              <div className="text-center">
                <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
                  Von plausiblen Antworten zu prüfbaren Entscheidungen.
                </h2>
                <p className="mx-auto mt-2 max-w-[70ch] text-sm text-slate-700">
                  Öffne die Demo und verfolge live, wie Kontextknoten, Belege und Ableitungspfad zusammenspielen.
                </p>
                <TrackedLink
                  href="/demo"
                  label="Demo öffnen"
                  eventName="landing_cta_click"
                  payload={{ target: "/demo", surface: "closing-cta" }}
                  className="mt-5 inline-flex rounded-md bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700"
                />
              </div>
            </div>
            </section>
          </LandingReveal>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
