import { FileCheck2, Rocket, Route } from "lucide-react";

export function HeroLearningStage(): React.JSX.Element {
  return (
    <section className="relative overflow-hidden bg-white py-12 sm:py-16">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100/50 to-slate-50/10 -z-10" />

      <div className="mx-auto w-full max-w-295 px-4 sm:px-6">
        <div className="relative z-10 space-y-6">
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">System GraphRAG Sandbox</p>
            <h1 className="max-w-3xl text-[2.25rem] font-bold tracking-tight text-slate-900 sm:text-[2.75rem] leading-tight">
              Entscheidungsarchitektur live testen.
            </h1>
            <p className="max-w-[70ch] text-[1.125rem] leading-relaxed text-slate-700 font-medium">
              Verfolge in Echtzeit, wie aus einer isolierten Frage eine belegbare, systemische Entscheidung abgeleitet wird.
            </p>
          </div>

          <section className="glass-panel rounded-3xl p-6 sm:p-10 relative overflow-hidden mt-8">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-50/40 to-indigo-50/20 -z-10" />
            
            <div className="grid gap-10 md:grid-cols-2 lg:gap-16">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-900">Der Systemic-Use-Case</h3>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-slate-600 font-medium">
                    Warum "System Thinking"? Komplexe Organisationen operieren in vernetzten Abhängigkeiten.
                    Fließtext allein reicht nicht aus, um Engpässe und Hebelwirkungen auditierbar aufzuzeigen. 
                    Diese Demo beweist, wie GraphRAG isolierte Dokumente zu einem logischen Entscheidungsnetz verstrickt.
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-900">Was evaluiert wird</h3>
                  <ul className="mt-4 space-y-3 text-[0.95rem] text-slate-600 font-medium">
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.5)]" />
                      <span>Transparente Kontextbindung statt RAG-Blackbox</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.5)]" />
                      <span>Lückenloser Belegpfad für jede abgeleitete Behauptung</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.5)]" />
                      <span>Messbare Stabilität bei iterativen Folgefragen</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col justify-center rounded-2xl border border-slate-200/60 bg-white/80 p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Pipeline Starten</p>
                <p className="mt-2 text-base text-slate-800 font-semibold">
                  Sende eine Frage an die Infrastruktur.
                </p>
                <p className="mt-1 text-sm text-slate-600 font-medium">
                  Beobachte die dynamische Knoten-Auswahl und den LLM-Prompt in Echtzeit.
                </p>
                <div className="mt-6">
                  <a
                    href="#antwortfuehrung"
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-slate-900/20 transition-all hover:bg-sky-600 hover:-translate-y-1 hover:shadow-sky-600/30"
                  >
                    Zur Auswertung
                  </a>
                </div>
              </div>
            </div>
          </section>

          <ul className="grid gap-4 pt-4 sm:grid-cols-3">
            <li className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-900">
                <Route className="h-4 w-4 text-sky-600" aria-hidden />
                <span>Herleiten</span>
              </p>
              <p className="mt-2 text-[0.95rem] text-slate-600 font-medium leading-relaxed">Der Pipeline-Weg macht sichtbar, wie aus Frage, Kontext und Belegen eine belastbare Antwort entsteht.</p>
            </li>
            <li className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-900">
                <FileCheck2 className="h-4 w-4 text-sky-600" aria-hidden />
                <span>Belegen</span>
              </p>
              <p className="mt-2 text-[0.95rem] text-slate-600 font-medium leading-relaxed">Kernnachweis und Referenzen zeigen transparent, worauf sich die Argumentation der AI stützt.</p>
            </li>
            <li className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-900">
                <Rocket className="h-4 w-4 text-sky-600" aria-hidden />
                <span>Umsetzen</span>
              </p>
              <p className="mt-2 text-[0.95rem] text-slate-600 font-medium leading-relaxed">Strukturierte Folgeschritte übersetzen analytische Einsichten in direkt handlungsfähige Maßnahmen.</p>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
