export function HeroLearningStage(): React.JSX.Element {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#eaf3ff] via-[#f6fbff] to-[#eef2ff] px-5 py-6 sm:px-8 sm:py-8">
      <div className="pointer-events-none absolute -left-20 top-0 h-56 w-56 rounded-full bg-sky-300/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-48 w-48 rounded-full bg-indigo-300/20 blur-3xl" />

      <div className="relative z-10 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-800">System GraphRAG</p>
        <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          Verstehen, warum GraphRAG bessere Entscheidungen ermöglicht
        </h1>
        <p className="max-w-3xl text-base leading-7 text-slate-700">
          Stelle eine präzise Frage, verfolge den Herleitungsweg im Graphen und überführe die Antwort in
          konkrete nächste Schritte.
        </p>

        <section className="rounded-2xl border border-sky-200/80 bg-white/80 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-800">
            Warum nicht nur LLM direkt?
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            Ich nutze System Thinking als Beispiel für GraphRAG, weil es aus vielen vernetzten Konzepten
            besteht, die man isoliert leicht missversteht. Genau hier zeigt GraphRAG seinen Mehrwert: Er
            verbindet Begriffe, Beziehungen und Belege sichtbar zu einer nachvollziehbaren Antwort. Statt
            nur einer plausiblen LLM-Antwort bekomme ich eine prüfbare Herleitung mit Quellen, Knoten und
            Kanten.
          </p>
          <p className="mt-2 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-sm font-medium text-sky-900">
            System Thinking ist kein lineares Thema, sondern ein Beziehungsnetz. Deshalb ist es der ideale
            Use Case, um den Unterschied zwischen LLM-only und GraphRAG zu zeigen.
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Nur LLM</p>
              <ul className="mt-2 space-y-1 text-sm text-slate-700">
                <li>Antwort oft plausibel, aber Herkunft bleibt unklar.</li>
                <li>Weniger stabil bei komplexen Fragen mit mehreren Ursachen.</li>
                <li>Schwerer zu prüfen, ob Schlussfolgerungen belastbar sind.</li>
              </ul>
            </div>
            <div className="rounded-xl border border-sky-200 bg-sky-50/70 p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-sky-800">Mit GraphRAG</p>
              <ul className="mt-2 space-y-1 text-sm text-slate-800">
                <li>Antwort basiert auf konkreten Knoten, Kanten und Quellen.</li>
                <li>Herleitung ist im Graph sichtbar statt nur im Fließtext.</li>
                <li>Referenzen und Belege machen die Antwort überprüfbar.</li>
              </ul>
            </div>
          </div>
        </section>

        <ul className="grid gap-3 pt-1 sm:grid-cols-3">
          <li className="rounded-xl border border-white/70 bg-white/75 p-3 text-sm text-slate-700 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">Lernen</p>
            <p className="mt-1">Der Pipeline-Weg macht sichtbar, wie aus Frage und Kontext eine Antwort entsteht.</p>
          </li>
          <li className="rounded-xl border border-white/70 bg-white/75 p-3 text-sm text-slate-700 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">Verstehen</p>
            <p className="mt-1">Kernnachweis und Referenzen zeigen sofort, worauf sich die Antwort stützt.</p>
          </li>
          <li className="rounded-xl border border-white/70 bg-white/75 p-3 text-sm text-slate-700 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">Handeln</p>
            <p className="mt-1">Empfohlene Folgeschritte übersetzen Einsichten in direkt nutzbare Aktionen.</p>
          </li>
        </ul>
      </div>
    </section>
  );
}
