"use client";

import { SiteFooter } from "@/components/organisms/site-footer";
import { SiteHeader } from "@/components/organisms/site-header";
import { TrackedLink } from "@/components/molecules/tracked-link";
import { TrackedPageView } from "@/components/molecules/tracked-page-view";
import { GraphRagStateLab } from "@/features/story/organisms/GraphRagStateLab";

export function GraphRagStoryTemplate(): React.JSX.Element {
  return (
    <div className="flex min-h-screen flex-col bg-slate-100 text-slate-950">
      <TrackedPageView page="/story/graphrag" />
      <SiteHeader />
      <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <div className="mx-auto w-full max-w-[1280px] space-y-8">
          <section className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">GraphRAG Story</p>
            <h1 className="max-w-4xl text-[2.75rem] font-semibold leading-tight tracking-tight sm:text-[3rem]">
              Struktur sichtbar machen
            </h1>
            <p className="max-w-3xl text-[1.04rem] leading-7 text-slate-700">
              Kein Story-Template, kein Scroll-Drama. Ein strukturierter Denkraum, in dem Zustände direkt vergleichbar
              sind.
            </p>
          </section>

          <GraphRagStateLab />

          <section className="rounded-2xl border border-slate-300/70 bg-white px-5 py-6 sm:px-6">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Abschluss</p>
            <p className="mt-2 text-xl font-semibold text-slate-900">GraphRAG ist kein besseres Suchfeld.</p>
            <p className="text-lg text-slate-700">Es ist Entscheidungsinfrastruktur.</p>

            <div className="mt-5">
              <TrackedLink
                href="/demo"
                label="Projekt anfragen"
                eventName="story_project_request_click"
                payload={{ surface: "graphrag_story" }}
                className="inline-flex rounded-md bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
              />
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
