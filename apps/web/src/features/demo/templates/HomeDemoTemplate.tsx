import { QueryPanel } from "@/components/organisms/query-panel";
import { SiteFooter } from "@/components/organisms/site-footer";
import { SiteHeader } from "@/components/organisms/site-header";

export function HomeDemoTemplate(): React.JSX.Element {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <SiteHeader />

      <main className="flex-1">
        <section className="border-b border-slate-200/70 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.1),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,252,0.92))]">
          <div className="mx-auto w-full max-w-295 px-4 py-8 sm:px-6 sm:py-10">
            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-600">Live Demo</p>
              <h1 className="headline-wrap max-w-[18ch] text-[1.8rem] font-bold tracking-tight text-slate-950 sm:text-[2.35rem]">
                Stelle direkt eine Frage und prüfe die Herleitung live.
              </h1>
              <p className="max-w-[70ch] text-base leading-relaxed text-slate-700 font-medium sm:text-[1.05rem]">
                Diese Seite ist die operative Demo. Der interaktive GraphRAG-Workflow steht direkt unter diesem Intro.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-295 px-4 py-8 sm:px-6 sm:py-10">
          <div id="antwortfuehrung" className="scroll-mt-24 sm:scroll-mt-28">
            <QueryPanel />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
