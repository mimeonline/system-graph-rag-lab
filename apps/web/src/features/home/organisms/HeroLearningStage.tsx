import { FileCheck2, Route, Rocket } from "lucide-react";

export function HeroLearningStage(): React.JSX.Element {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#eaf3ff] via-[#f6fbff] to-[#eef2ff] py-6 sm:py-8">
      <div className="pointer-events-none absolute -left-20 top-0 h-56 w-56 rounded-full bg-sky-300/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-48 w-48 rounded-full bg-indigo-300/20 blur-3xl" />

      <div className="mx-auto w-full max-w-295 px-4 sm:px-6">
        <div className="relative z-10 space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-800">System GraphRAG</p>
          <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            System Thinking als Live-GraphRAG-Demo
          </h1>
          <p className="max-w-3xl text-base leading-7 text-slate-700">
            Diese Demo zeigt, wie aus einer systemischen Frage über Graph-Retrieval eine nachvollziehbare,
            belegte Antwort entsteht.
          </p>

          <section className="rounded-2xl border border-sky-200/70 bg-white/65 p-4">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-800">Warum System Thinking?</p>
                <p className="text-sm leading-6 text-slate-700">
                  System Thinking eignet sich als Beispiel, weil es aus vernetzten Konzepten besteht.
                  Isolierte Textantworten führen hier schnell zu Vereinfachungen.
                  Hier siehst du den Unterschied konkret: Auswahl, Belege und Ableitungspfad.
                </p>
              </div>

              <div className="space-y-1.5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">So nutzt du die Demo</p>
                <ol className="space-y-1.5 text-sm text-slate-700">
                  <li>1. Formuliere oder wähle eine systemische Frage.</li>
                  <li>2. Sende die Anfrage.</li>
                  <li>3. Verfolge, welche Knoten, Belege und Beziehungen ins LLM gehen.</li>
                  <li>4. Prüfe Ableitung, Referenzen und nächste Schritte.</li>
                </ol>
              </div>

              <div className="space-y-1.5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">Was du erhältst</p>
                <ul className="space-y-1.5 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-sky-600" />
                    <span>sichtbaren Kontext</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-sky-600" />
                    <span>nachvollziehbare Belegpfade</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-sky-600" />
                    <span>strukturierte Folgeschritte</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white px-3 py-2.5">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">Bereit?</p>
                <p className="mt-1 text-sm text-slate-700">
                  Springe zur Antwortführung und teste eine konkrete Frage im System Thinking Kontext.
                </p>
                <a
                  href="#antwortfuehrung"
                  className="mt-2 inline-flex rounded-md bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-sky-700"
                >
                  Zur Antwortführung
                </a>
              </div>
            </div>
          </section>

          <ul className="grid gap-3 pt-1 sm:grid-cols-3">
            <li className="rounded-xl border border-white/70 bg-white/70 p-3 text-sm text-slate-700">
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
                <Route className="h-3.5 w-3.5 text-sky-700" aria-hidden />
                <span>Herleiten</span>
              </p>
              <p className="mt-1">Der Pipeline-Weg macht sichtbar, wie aus Frage, Kontext und Belegen eine belastbare Antwort entsteht.</p>
            </li>
            <li className="rounded-xl border border-white/70 bg-white/70 p-3 text-sm text-slate-700">
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
                <FileCheck2 className="h-3.5 w-3.5 text-sky-700" aria-hidden />
                <span>Belegen</span>
              </p>
              <p className="mt-1">Kernnachweis und Referenzen zeigen transparent, worauf sich die Argumentation stützt.</p>
            </li>
            <li className="rounded-xl border border-white/70 bg-white/70 p-3 text-sm text-slate-700">
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
                <Rocket className="h-3.5 w-3.5 text-sky-700" aria-hidden />
                <span>Umsetzen</span>
              </p>
              <p className="mt-1">Konkrete Folgeschritte übersetzen Einsichten in direkt handlungsfähige Maßnahmen.</p>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
