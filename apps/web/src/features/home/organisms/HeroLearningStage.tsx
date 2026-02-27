export function HeroLearningStage(): React.JSX.Element {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-sky-200/70 bg-gradient-to-br from-[#eaf3ff] via-[#f6fbff] to-[#eef2ff] px-5 py-6 shadow-sm sm:px-8 sm:py-8">
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
