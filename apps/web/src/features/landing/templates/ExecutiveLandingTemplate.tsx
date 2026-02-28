import { TrackedLink } from "@/components/molecules/tracked-link";
import { TrackedPageView } from "@/components/molecules/tracked-page-view";
import { SiteFooter } from "@/components/organisms/site-footer";
import { SiteHeader } from "@/components/organisms/site-header";
import { ExecutiveHeroGraph } from "@/features/landing/molecules/ExecutiveHeroGraph";

export function ExecutiveLandingTemplate(): React.JSX.Element {
  return (
    <div className="flex min-h-screen flex-col bg-[#f4f8ff] text-slate-900">
      <TrackedPageView page="/" />
      <SiteHeader />

      <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <div className="mx-auto w-full max-w-295 space-y-12">
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
                GraphRAG macht Herleitung prüfbar: Belege, Beziehungen und Ableitungspfad werden sichtbar.
                Für Architektur und Produktentscheidungen, bei denen LLM Antworten ohne Struktur nicht ausreichen.
              </p>
              <p className="max-w-[70ch] text-sm leading-6 text-slate-600">
                Interaktive Demo mit Neo4j, kontrolliertem Retrieval und expliziter Beziehungslogik.
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
                  className="inline-flex rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
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

              <div className="w-full max-w-[560px] self-start justify-self-center rounded-2xl border border-slate-200/75 bg-white/65 p-4 sm:p-5 lg:justify-self-end">
                <ExecutiveHeroGraph />
              </div>
            </div>
          </section>

          <section
            id="rag-vs-graphrag"
            className="space-y-4 rounded-2xl border border-slate-200/70 bg-white/60 p-4 sm:p-6"
          >
            <h2 className="text-lg font-semibold text-slate-900">
              RAG vs GraphRAG
            </h2>
            <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white/70">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50/80">
                  <tr className="text-slate-600">
                    <th className="px-4 py-3 font-semibold">Dimension</th>
                    <th className="px-4 py-3 font-semibold">RAG</th>
                    <th className="px-4 py-3 font-semibold">GraphRAG</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/80 text-slate-700">
                  <tr>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      Kontext
                    </td>
                    <td className="px-4 py-3">Textfragmente</td>
                    <td className="px-4 py-3">Beziehungsnetz</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      Nachvollziehbarkeit
                    </td>
                    <td className="px-4 py-3">implizit</td>
                    <td className="px-4 py-3">explizit</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      Mehr Hop Kontext
                    </td>
                    <td className="px-4 py-3">eingeschränkt</td>
                    <td className="px-4 py-3">kontrolliert</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      Anschlussfragen
                    </td>
                    <td className="px-4 py-3">driftet häufiger</td>
                    <td className="px-4 py-3">stabiler durch Struktur</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      Entscheidungslogik
                    </td>
                    <td className="px-4 py-3">im Fließtext</td>
                    <td className="px-4 py-3">als Pfad sichtbar</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-2xl border border-sky-200/80 bg-sky-50/75 p-4 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-sky-700">
                  Nächster Schritt
                </p>
                <p className="mt-1 text-sm text-slate-800">
                  Interaktive Demo öffnen und den Herleitungsweg live sehen.
                </p>
              </div>
              <TrackedLink
                href="/demo"
                label="Interaktive Demo öffnen"
                eventName="landing_cta_click"
                payload={{ target: "/demo", surface: "footer-cta" }}
                className="inline-flex rounded-md bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700"
              />
            </div>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
