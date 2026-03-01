"use client";

import { TrackedLink } from "@/components/molecules/tracked-link";
import { TrackedPageView } from "@/components/molecules/tracked-page-view";
import { SiteFooter } from "@/components/organisms/site-footer";
import { SiteHeader } from "@/components/organisms/site-header";
import { GraphRagStateLab } from "@/features/story/organisms/GraphRagStateLab";

export function GraphRagStoryTemplate(): React.JSX.Element {
  return (
    <div className="flex min-h-screen flex-col bg-slate-100 text-slate-950">
      <TrackedPageView page="/story/graphrag" />
      <SiteHeader />
      <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <div className="mx-auto w-full max-w-[1280px] space-y-8">
          <section className="space-y-4 pt-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">GraphRAG Story</p>
            <h1 className="max-w-4xl text-[2.75rem] font-bold leading-tight tracking-tight sm:text-[3.25rem]">
              Struktur sichtbar machen
            </h1>
            <p className="max-w-3xl text-[1.125rem] leading-relaxed text-slate-700 font-medium">
              Kein Story-Template, kein Scroll-Drama. Ein strukturierter Denkraum, in dem Zustände direkt vergleichbar
              sind.
            </p>
          </section>

          <GraphRagStateLab />

          <section className="glass-panel rounded-3xl p-8 sm:p-12 relative overflow-hidden mt-12">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-slate-100/50 -z-10" />
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Abschluss</p>
              <h2 className="mt-4 text-[1.5rem] font-bold text-slate-900 sm:text-[1.75rem] leading-tight">
                GraphRAG ist kein besseres Suchfeld.
              </h2>
              <p className="text-[1.25rem] text-slate-700 font-medium mt-1">Es ist Entscheidungsinfrastruktur.</p>

              <div className="mt-8">
                <TrackedLink
                  href="/demo"
                  label="Projekt anfragen"
                  eventName="story_project_request_click"
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
