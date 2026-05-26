"use client";

import { TrackedLink } from "@/components/molecules/tracked-link";
import { TrackedPageView } from "@/components/molecules/tracked-page-view";
import { SiteFooter } from "@/components/organisms/site-footer";
import { SiteHeader } from "@/components/organisms/site-header";
import { DEMO_GRAPH_TYPES } from "@/features/demo/graph-type-learning-model";
import { GraphRagTechnicalFlow } from "@/features/story/organisms/GraphRagTechnicalFlow";

type GraphRagStoryTemplateProps = {
  locale: "de" | "en";
};

export function GraphRagStoryTemplate({
  locale,
}: GraphRagStoryTemplateProps): React.JSX.Element {
  const isEn = locale === "en";

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 text-slate-950">
      <TrackedPageView page="/story/graphrag" />
      <SiteHeader />
      <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <div className="mx-auto w-full max-w-[1280px] space-y-8">
          <section className="space-y-4 pt-4">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">GraphRAG Story</p>
              <span className="text-xs text-slate-400">·</span>
              <p className="text-xs text-slate-400">
                {isEn ? "approx. 4 min read" : "ca. 4 Min. Lesezeit"}
              </p>
            </div>
            <h1 className="headline-wrap max-w-4xl text-[1.9rem] font-bold leading-tight tracking-tight sm:text-[3.25rem]">
              {isEn
                ? "Why GraphRAG needs more than one graph"
                : "Warum GraphRAG mehr als einen Graph braucht"}
            </h1>
            <p className="max-w-3xl text-base leading-relaxed text-slate-700 font-medium sm:text-[1.125rem]">
              {isEn
                ? "The story explains how a user question becomes a structured answer when documents, domain context, semantic knowledge, conversation memory, and time are modelled separately."
                : "Die Story erklärt, wie aus einer Nutzerfrage eine strukturierte Antwort wird, wenn Dokumente, Domänenkontext, semantisches Wissen, Gesprächs-Memory und Zeit getrennt modelliert werden."}
            </p>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {DEMO_GRAPH_TYPES.map((graphType) => {
              const Icon = graphType.icon;
              return (
                <TrackedLink
                  key={graphType.id}
                  href={`/demo/${graphType.slug}`}
                  label={graphType.title}
                  eventName="story_graph_type_click"
                  payload={{ graphType: graphType.id }}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-sky-300 hover:shadow-md"
                >
                  <Icon className="h-5 w-5 text-sky-600" aria-hidden />
                  <h2 className="mt-4 text-base font-bold text-slate-950">{graphType.title}</h2>
                  <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{graphType.badge}</p>
                </TrackedLink>
              );
            })}
          </section>

          <GraphRagTechnicalFlow locale={locale} />

          <section className="glass-panel relative mt-12 overflow-hidden rounded-3xl p-6 sm:p-12">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-slate-100/50 -z-10" />

            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                {isEn ? "Conclusion" : "Abschluss"}
              </p>
              <h2 className="headline-wrap mt-4 text-[1.5rem] font-bold text-slate-900 sm:text-[1.75rem] leading-tight">
                {isEn ? "GraphRAG is a modelling discipline." : "GraphRAG ist eine Modellierungsdisziplin."}
              </h2>
              <p className="mt-1 text-lg text-slate-700 font-medium sm:text-[1.25rem]">
                {isEn
                  ? "The architecture becomes useful when each graph type does its own job and the LLM receives a controlled context package."
                  : "Die Architektur wird nützlich, wenn jeder Graph-Typ seine eigene Aufgabe erfüllt und das LLM ein kontrolliertes Kontextpaket bekommt."}
              </p>

              <div className="mt-8">
                <TrackedLink
                  href="/demo"
                  label={isEn ? "Open demo" : "Zur Demo"}
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
