import { ArrowRight, Scale } from "lucide-react";

import { TrackedLink } from "@/components/molecules/tracked-link";
import { SiteFooter } from "@/components/organisms/site-footer";
import { SiteHeader } from "@/components/organisms/site-header";
import { DEMO_GRAPH_TYPES } from "@/features/demo/graph-type-learning-model";

type DemoOverviewTemplateProps = {
  locale: "de" | "en";
};

export function DemoOverviewTemplate({ locale }: DemoOverviewTemplateProps): React.JSX.Element {
  const isEn = locale === "en";
  const copy = {
    eyebrow: isEn ? "EU AI Act GraphRAG learning mode" : "EU-AI-Act-GraphRAG-Lernmodus",
    title: isEn
      ? "Five graph types for one launch decision."
      : "Fünf Graph-Typen für eine Launch-Entscheidung.",
    intro: isEn
      ? "This overview explains the five modelling methods before the detail pages show the simulated graph patterns."
      : "Diese Übersicht erklärt die fünf Modellierungsmethoden, bevor die Detailseiten die simulierten Graphmuster zeigen.",
    frameTitle: isEn ? "The shared demo question" : "Die gemeinsame Demo-Frage",
    frameBody: isEn
      ? "Can we launch an AI feature for EU customers, and what evidence, roles, obligations, memory, and timing matter?"
      : "Dürfen wir ein KI-Feature für EU-Kunden launchen, und welche Belege, Rollen, Pflichten, Gesprächskontexte und Zeitpunkte sind dafür relevant?",
    methodsTitle: isEn ? "The five methods" : "Die fünf Methoden",
    methodsIntro: isEn
      ? "Each graph type answers a different architectural question. Together they show why GraphRAG is more than putting documents into a vector store."
      : "Jeder Graph-Typ beantwortet eine andere Architekturfrage. Zusammen zeigen sie, warum GraphRAG mehr ist als Dokumente in einen Vector Store zu legen.",
    comparisonTitle: isEn ? "How to read the overview" : "So liest du die Übersicht",
    comparisonBody: isEn
      ? "Start with the graph type that matches your uncertainty. Source uncertainty points to the document graph. Business responsibility points to the domain graph. Meaning and roles point to the knowledge graph. Follow-up context points to the conversational graph. Validity over time points to the dynamic graph."
      : "Starte mit dem Graph-Typ, der zu deiner Unsicherheit passt. Quellenunsicherheit führt zum Dokument-Graph. Geschäftsverantwortung zum Domänen-Graph. Bedeutung und Rollen zum Wissensgraph. Folgekontext zum Conversational Graph. Gültigkeit über Zeit zum dynamischen Graph.",
    open: isEn ? "Open method" : "Methode öffnen",
    liveTitle: isEn ? "Optional live mode" : "Optionaler Live-Modus",
    liveBody: isEn
      ? "The previous real System Thinking query flow remains available separately."
      : "Der bisherige echte System-Thinking-Query-Flow bleibt separat verfügbar.",
    liveCta: isEn ? "Open live mode" : "Live-Modus öffnen",
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <SiteHeader />

      <main className="flex-1">
        <section className="relative overflow-hidden bg-white py-14 sm:py-18">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-100/70 via-white to-sky-50/40" />
          <div className="mx-auto grid w-full max-w-295 gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(320px,0.55fr)] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-700">{copy.eyebrow}</p>
              <h1 className="headline-wrap mt-4 max-w-4xl text-[2.1rem] font-bold leading-tight tracking-tight text-slate-950 sm:text-[3rem]">
                {copy.title}
              </h1>
              <p className="mt-5 max-w-3xl text-[1.05rem] font-medium leading-relaxed text-slate-700 sm:text-[1.15rem]">
                {copy.intro}
              </p>
            </div>

            <div className="glass-panel rounded-3xl p-6">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                <Scale className="h-4 w-4 text-sky-600" aria-hidden />
                <span>{copy.frameTitle}</span>
              </p>
              <p className="mt-3 text-base font-semibold leading-relaxed text-slate-900">{copy.frameBody}</p>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-295 px-4 py-10 sm:px-6 sm:py-14">
          <div className="mb-7 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-700">{copy.methodsTitle}</p>
            <h2 className="mt-3 text-2xl font-bold text-slate-950 sm:text-3xl">
              {isEn ? "A map of GraphRAG modelling choices" : "Eine Landkarte für GraphRAG-Modellierung"}
            </h2>
            <p className="mt-3 text-base font-medium leading-relaxed text-slate-700">{copy.methodsIntro}</p>
          </div>

          <div className="grid gap-4">
            {DEMO_GRAPH_TYPES.map((graphType) => {
              const Icon = graphType.icon;

              return (
                <article key={graphType.id} className="border-t border-slate-200 py-6">
                  <div className="grid gap-5 lg:grid-cols-[4rem_minmax(0,0.9fr)_minmax(260px,0.6fr)_auto] lg:items-start">
                    <span className="text-[2rem] font-bold leading-none tabular-nums text-slate-300">
                      {graphType.number}
                    </span>
                    <div>
                      <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-sky-700">
                        <Icon className="h-4 w-4" aria-hidden />
                        <span>{graphType.badge}</span>
                      </p>
                      <h3 className="mt-2 text-xl font-bold text-slate-950">{graphType.title}</h3>
                      <p className="mt-2 max-w-3xl text-sm font-medium leading-relaxed text-slate-700">
                        {graphType.useCase}
                      </p>
                    </div>
                    <div className="space-y-3 text-sm font-medium leading-relaxed text-slate-700">
                      <p>
                        <span className="block text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                          {isEn ? "Core question" : "Kernfrage"}
                        </span>
                        {graphType.question}
                      </p>
                      <p>
                        <span className="block text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                          {isEn ? "Typical structure" : "Typische Struktur"}
                        </span>
                        {graphType.structure}
                      </p>
                    </div>
                    <TrackedLink
                      href={`/demo/${graphType.slug}`}
                      label={copy.open}
                      eventName="demo_overview_method_click"
                      payload={{ graphType: graphType.id }}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-sky-600"
                      icon={<ArrowRight className="h-4 w-4" aria-hidden />}
                    />
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mx-auto w-full max-w-295 px-4 pb-12 sm:px-6 sm:pb-16">
          <div className="grid gap-5 border-y border-slate-200 py-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(280px,0.45fr)] lg:items-center">
            <div>
              <h2 className="text-xl font-bold text-slate-950">{copy.comparisonTitle}</h2>
              <p className="mt-3 max-w-4xl text-sm font-medium leading-relaxed text-slate-700">{copy.comparisonBody}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-5">
              <p className="text-sm font-bold text-slate-950">{copy.liveTitle}</p>
              <p className="mt-1 text-sm font-medium leading-relaxed text-slate-600">{copy.liveBody}</p>
              <TrackedLink
                href="/demo/live"
                label={copy.liveCta}
                eventName="demo_overview_live_click"
                className="mt-4 inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-sky-300 hover:text-sky-700"
              />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
