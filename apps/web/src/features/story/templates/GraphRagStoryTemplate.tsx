"use client";

import { TrackedLink } from "@/components/molecules/tracked-link";
import { TrackedPageView } from "@/components/molecules/tracked-page-view";
import { SiteFooter } from "@/components/organisms/site-footer";
import { SiteHeader } from "@/components/organisms/site-header";
import { GraphRagTechnicalFlow } from "@/features/story/organisms/GraphRagTechnicalFlow";

export function GraphRagStoryTemplate(): React.JSX.Element {
  return (
    <div className="flex min-h-screen flex-col bg-slate-100 text-slate-950">
      <TrackedPageView page="/story/graphrag" />
      <SiteHeader />
      <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <div className="mx-auto w-full max-w-[1280px] space-y-8">
          <section className="space-y-4 pt-4">
            <div className="flex items-center gap-4">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">GraphRAG Story</p>
              <span className="text-xs text-slate-400">·</span>
              <p className="text-xs text-slate-400">ca. 4 Min. Lesezeit</p>
            </div>
            <h1 className="max-w-4xl text-[2.75rem] font-bold leading-tight tracking-tight sm:text-[3.25rem]">
              Von der Frage zur Entscheidung in 5 klaren Schritten
            </h1>
            <p className="max-w-3xl text-[1.125rem] leading-relaxed text-slate-700 font-medium">
              Wir zeigen Schritt für Schritt, wie aus einer ersten Frage eine klare Entscheidung entsteht.
              Dabei bleibt jeder Übergang nachvollziehbar: von der Auswahl des Kontexts über den Aufbau der Beziehungen
              bis zur begründeten Schlussfolgerung für das Team.
            </p>
          </section>

          <GraphRagTechnicalFlow />

          <section className="glass-panel rounded-3xl p-8 sm:p-12 relative overflow-hidden mt-12">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-slate-100/50 -z-10" />

            {/* C3: Summary pipeline diagram */}
            <figure className="mb-8 rounded-xl border border-slate-200/60 bg-white/60 p-4">
              <svg viewBox="0 0 660 60" className="h-auto w-full" role="img" aria-label="5-Schritt-Pipeline">
                {[
                  { x: 66, label: "Frage" },
                  { x: 198, label: "Kontext" },
                  { x: 330, label: "Graph" },
                  { x: 462, label: "Synthese" },
                  { x: 594, label: "Handlung" },
                ].map((step, i, arr) => (
                  <g key={step.label}>
                    {i < arr.length - 1 ? (
                      <line
                        x1={step.x + 36} y1="24" x2={arr[i + 1].x - 36} y2="24"
                        stroke="#0ea5e9" strokeWidth="2" strokeDasharray="4 3"
                      />
                    ) : null}
                    <rect x={step.x - 36} y="6" width="72" height="36" rx="8" fill="#f0f9ff" stroke="#0ea5e9" strokeWidth="1.5" />
                    <text x={step.x} y="29" textAnchor="middle" className="fill-sky-800 text-[11px] font-semibold">
                      {step.label}
                    </text>
                  </g>
                ))}
              </svg>
            </figure>

            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Abschluss</p>
              <h2 className="mt-4 text-[1.5rem] font-bold text-slate-900 sm:text-[1.75rem] leading-tight">
                GraphRAG ist mehr als ein besseres Suchfeld.
              </h2>
              <p className="text-[1.25rem] text-slate-700 font-medium mt-1">
                Es hilft Teams, Entscheidungen klar zu begründen und später erneut zu prüfen.
                So bleibt Wissen nicht nur im Kopf einzelner Personen, sondern in einem gemeinsamen, nutzbaren
                Entscheidungsweg.
              </p>

              <div className="mt-8">
                <TrackedLink
                  href="/demo"
                  label="Zur Demo"
                  eventName="story_demo_entry_click"
                  payload={{ surface: "graphrag_story" }}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-slate-900/20 transition-all hover:bg-sky-600 hover:-translate-y-1 hover:shadow-sky-600/30"
                />
              </div>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

