import { SectionTitle } from "@/components/atoms/section-title";
import { QueryPanel } from "@/components/organisms/query-panel";

/**
 * Zweck:
 * Rendert die Home-Ansicht als Template-Komposition ohne Business-Logik.
 *
 * Input:
 * - keiner
 *
 * Output:
 * - React.JSX.Element fuer die Startseite des MVP
 *
 * Fehlerfall:
 * - Kein eigener Fehlerpfad, Rendering folgt React-Komponentenbaum
 *
 * Beispiel:
 * - <HomeTemplate />
 */
export function HomeTemplate(): React.JSX.Element {
  return (
    <div className="flex min-h-screen flex-col bg-[#f4f7fb] text-slate-900">
      <header className="border-b border-[#16335d] bg-[#0c2345] text-white">
        <div className="mx-auto flex min-h-16 w-full max-w-[1180px] items-center justify-between gap-4 px-4 sm:px-6">
          <p className="text-sm font-semibold tracking-[0.01em]">System GraphRAG Demo</p>
          <p className="text-xs text-slate-200 sm:text-sm">GitHub · Info</p>
        </div>
      </header>

      <main className="flex-1 px-4 py-5 sm:px-6 sm:py-6">
        <div className="mx-auto grid w-full max-w-[1180px] gap-6">
          <SectionTitle
            eyebrow="System GraphRAG"
            title="Verstehen, warum GraphRAG hilft"
            description="Stelle eine Frage, sieh die Antwort, prüfe Referenzen und die Herleitung im Graphen. So wird aus abstraktem Wissen ein nachvollziehbarer Entscheidungsweg."
          />
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="space-y-2">
              <h2 className="text-base font-semibold text-slate-900">So funktioniert GraphRAG</h2>
              <p className="text-sm leading-6 text-slate-600">
                GraphRAG verbindet semantische Suche und Graphstruktur. Die Pipeline priorisiert relevante
                Knoten, baut daraus eine Antwort und zeigt transparent, welche Konzepte und Quellen genutzt wurden.
              </p>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">1. Frage</p>
                <p className="mt-2 text-sm text-slate-700">
                  Du formulierst ein Problem im Systemkontext. Das Retrieval startet mit genau diesem Fokus.
                </p>
              </article>
              <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  2. Graph-Kontext
                </p>
                <p className="mt-2 text-sm text-slate-700">
                  Relevante Knoten und Beziehungen werden als Referenzen gerankt und visuell verknüpft.
                </p>
              </article>
              <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">3. Handlungswert</p>
                <p className="mt-2 text-sm text-slate-700">
                  Die Antwort zeigt Kernbegründung, Quellen und nächste Schritte für konkrete Entscheidungen.
                </p>
              </article>
            </div>
          </section>
          <QueryPanel />
        </div>
      </main>

      <footer className="border-t border-[#12335f] bg-[#0a1f3b] text-slate-200">
        <div className="mx-auto flex min-h-[52px] w-full max-w-[1180px] items-center justify-between gap-4 px-4 text-xs sm:px-6">
          <span>System GraphRAG Public MVP</span>
          <span className="text-right">Ruhiges, professionelles Layout mit klarer Hierarchie</span>
        </div>
      </footer>
    </div>
  );
}
