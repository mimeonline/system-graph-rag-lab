import { SiteFooter } from "@/components/organisms/site-footer";
import { SiteHeader } from "@/components/organisms/site-header";
import { GraphTypeLearningMode } from "@/features/demo/organisms/GraphTypeLearningMode";

type HomeDemoTemplateProps = {
  locale: "de" | "en";
};

export async function HomeDemoTemplate({
  locale,
}: HomeDemoTemplateProps): Promise<React.JSX.Element> {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <SiteHeader />

      <main className="flex-1">
        <section className="relative overflow-hidden bg-white py-14 sm:py-18">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-100/70 via-white to-sky-50/40" />
          <div className="mx-auto grid w-full max-w-295 gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(320px,0.55fr)] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-700">
                {locale === "en" ? "EU AI Act GraphRAG learning mode" : "EU-AI-Act-GraphRAG-Lernmodus"}
              </p>
              <h1 className="headline-wrap mt-4 max-w-4xl text-[2.1rem] font-bold leading-tight tracking-tight text-slate-950 sm:text-[3rem]">
                {locale === "en"
                  ? "Understand five graph types through one launch decision."
                  : "Fünf Graph-Typen anhand einer Launch-Entscheidung verstehen."}
              </h1>
              <p className="mt-5 max-w-3xl text-[1.05rem] font-medium leading-relaxed text-slate-700 sm:text-[1.15rem]">
                {locale === "en"
                  ? "This demo uses the EU AI Act as source material and shows how document, domain, knowledge, conversational, and dynamic graphs shape retrieval, evidence, memory, and decision logic."
                  : "Diese Demo nutzt den EU AI Act als Quellmaterial und zeigt, wie Dokument-Graph, Domänen-Graph, Wissensgraph, Conversational Graph und dynamischer Graph Retrieval, Belege, Memory und Entscheidungslogik prägen."}
              </p>
            </div>

            <div className="glass-panel rounded-3xl p-6">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                {locale === "en" ? "What this page does" : "Was diese Seite leistet"}
              </p>
              <p className="mt-3 text-base font-semibold leading-relaxed text-slate-900">
                {locale === "en"
                  ? "It is the entry point. Pick a graph type, inspect the simulation, then open the dedicated explanation page."
                  : "Sie ist der Einstieg. Wähle einen Graph-Typ, betrachte die Simulation und öffne danach die passende Erklärseite."}
              </p>
            </div>
          </div>
        </section>

        <GraphTypeLearningMode locale={locale} />
      </main>

      <SiteFooter />
    </div>
  );
}
