"use client";

import { useMemo, useState } from "react";

type StoryState = "text" | "structure" | "decision";
type Perspective = "architecture" | "product";

const STATE_LABELS: Record<StoryState, string> = {
  text: "Textbasierte Verdichtung",
  structure: "Strukturierung",
  decision: "Entscheidungszustand",
};

const STATE_CAPTIONS: Record<StoryState, string> = {
  text: "Text verdichtet Wahrscheinlichkeit. Struktur bleibt implizit.",
  structure: "Struktur ersetzt implizite Annahmen.",
  decision: "Entscheidungsfähigkeit entsteht aus explizitem Pfad.",
};

export function GraphRagStateLab(): React.JSX.Element {
  const [activeState, setActiveState] = useState<StoryState>("structure");
  const [showRelations, setShowRelations] = useState(true);
  const [showEvidence, setShowEvidence] = useState(true);
  const [showPath, setShowPath] = useState(true);
  const [simulateVariation, setSimulateVariation] = useState(false);
  const [perspective, setPerspective] = useState<Perspective>("architecture");

  const contextLabel = useMemo(() => {
    if (perspective === "product") {
      return "Kontext: Produktentscheidung";
    }
    return "Kontext: Architekturentscheidung";
  }, [perspective]);

  return (
    <section className="space-y-5 rounded-2xl border border-slate-300/70 bg-white p-4 shadow-sm sm:p-5">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Strukturraum</p>
        <h2 className="text-[1.92rem] font-semibold tracking-tight text-slate-950">Drei-Zustände-Modell</h2>
        <p className="text-[1.02rem] leading-7 text-slate-700">
          Direkter Vergleich zwischen textzentrierter Verdichtung, strukturierter Herleitung und stabilem
          Entscheidungszustand.
        </p>
      </header>

      <div className="grid gap-3 lg:grid-cols-3">
        {(["text", "structure", "decision"] as const).map((state) => {
          const isActive = state === activeState;
          return (
            <button
              key={state}
              type="button"
              onClick={() => setActiveState(state)}
              className={`rounded-xl border px-4 py-4 text-left transition ${
                isActive
                  ? "border-sky-500 bg-sky-50/70"
                  : "border-slate-300/80 bg-white hover:border-slate-400"
              }`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
                Zustand {state === "text" ? "1" : state === "structure" ? "2" : "3"}
              </p>
              <p className="mt-1 text-base font-semibold text-slate-900">{STATE_LABELS[state]}</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">{STATE_CAPTIONS[state]}</p>
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
        <section className="rounded-xl border border-slate-300/80 bg-slate-950 p-3">
          <div className="h-[390px] overflow-hidden rounded-lg bg-[radial-gradient(circle_at_18%_18%,rgba(56,189,248,0.18),rgba(2,6,23,0.98))]">
            {activeState === "text" ? (
              <TextStateCanvas />
            ) : null}
            {activeState === "structure" ? (
              <StructureStateCanvas showRelations={showRelations} showEvidence={showEvidence} />
            ) : null}
            {activeState === "decision" ? (
              <DecisionStateCanvas showPath={showPath} simulateVariation={simulateVariation} />
            ) : null}
          </div>
        </section>

        <aside className="space-y-3 rounded-xl border border-slate-300/80 bg-slate-50/80 p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Perspektive</p>
          <div className="inline-flex w-full rounded-md border border-slate-300 bg-white p-1">
            <button
              type="button"
              onClick={() => setPerspective("architecture")}
              className={`flex-1 rounded px-2 py-1.5 text-xs font-semibold transition ${
                perspective === "architecture" ? "bg-slate-900 text-white" : "text-slate-700"
              }`}
            >
              Architektur
            </button>
            <button
              type="button"
              onClick={() => setPerspective("product")}
              className={`flex-1 rounded px-2 py-1.5 text-xs font-semibold transition ${
                perspective === "product" ? "bg-slate-900 text-white" : "text-slate-700"
              }`}
            >
              Produkt
            </button>
          </div>

          <p className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700">{contextLabel}</p>

          {activeState === "structure" ? (
            <div className="space-y-2 rounded-md border border-slate-300 bg-white p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Sichtbarkeit</p>
              <label className="flex items-center justify-between text-sm text-slate-700">
                Zeige Beziehungen
                <input type="checkbox" checked={showRelations} onChange={(e) => setShowRelations(e.target.checked)} />
              </label>
              <label className="flex items-center justify-between text-sm text-slate-700">
                Zeige Belege
                <input type="checkbox" checked={showEvidence} onChange={(e) => setShowEvidence(e.target.checked)} />
              </label>
            </div>
          ) : null}

          {activeState === "decision" ? (
            <div className="space-y-2 rounded-md border border-slate-300 bg-white p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Vergleich</p>
              <label className="flex items-center justify-between text-sm text-slate-700">
                Pfad einblenden
                <input type="checkbox" checked={showPath} onChange={(e) => setShowPath(e.target.checked)} />
              </label>
              <label className="flex items-center justify-between text-sm text-slate-700">
                Variation simulieren
                <input
                  type="checkbox"
                  checked={simulateVariation}
                  onChange={(e) => setSimulateVariation(e.target.checked)}
                />
              </label>
            </div>
          ) : null}

          <p className="text-sm leading-6 text-slate-700">{STATE_CAPTIONS[activeState]}</p>
        </aside>
      </div>
    </section>
  );
}

function TextStateCanvas(): React.JSX.Element {
  return (
    <svg viewBox="0 0 1000 390" className="h-full w-full">
      <rect x="80" y="58" width="380" height="250" rx="14" fill="#e2e8f0" opacity="0.96" />
      <rect x="520" y="58" width="400" height="250" rx="14" fill="#e2e8f0" opacity="0.96" />
      <text x="110" y="92" className="fill-slate-700 text-[14px] font-semibold uppercase">Antworten</text>
      <text x="110" y="130" className="fill-slate-600 text-[13px]">• plausible Zusammenfassung</text>
      <text x="110" y="162" className="fill-slate-600 text-[13px]">• alternative Deutung</text>
      <text x="110" y="194" className="fill-slate-600 text-[13px]">• offene Gewichtung</text>
      <text x="110" y="226" className="fill-slate-600 text-[13px]">• uneinheitliche Schlussfolgerung</text>

      <text x="550" y="92" className="fill-slate-700 text-[14px] font-semibold uppercase">Quellenliste</text>
      <text x="550" y="130" className="fill-slate-600 text-[13px]">Dokument A</text>
      <text x="550" y="158" className="fill-slate-600 text-[13px]">Dokument B</text>
      <text x="550" y="186" className="fill-slate-600 text-[13px]">Dokument C</text>
      <text x="550" y="214" className="fill-slate-600 text-[13px]">Dokument D</text>

      <line x1="250" y1="296" x2="700" y2="296" stroke="rgba(148,163,184,0.8)" strokeWidth="2" strokeDasharray="6 6" />
      <text x="500" y="330" textAnchor="middle" className="fill-slate-300 text-[14px]">
        Keine explizite Beziehungslogik
      </text>
    </svg>
  );
}

function StructureStateCanvas({
  showRelations,
  showEvidence,
}: {
  showRelations: boolean;
  showEvidence: boolean;
}): React.JSX.Element {
  return (
    <svg viewBox="0 0 1000 390" className="h-full w-full">
      <rect x="80" y="72" width="170" height="64" rx="14" fill="#f8fafc" stroke="#7dd3fc" strokeWidth="2" />
      <text x="165" y="108" textAnchor="middle" className="fill-slate-900 text-[14px] font-semibold">Kernfrage</text>

      <rect x="340" y="56" width="190" height="64" rx="14" fill="#dbeafe" stroke="#38bdf8" strokeWidth="2" />
      <text x="435" y="92" textAnchor="middle" className="fill-slate-900 text-[14px] font-semibold">Begriff A</text>

      <rect x="340" y="168" width="190" height="64" rx="14" fill="#dbeafe" stroke="#38bdf8" strokeWidth="2" />
      <text x="435" y="204" textAnchor="middle" className="fill-slate-900 text-[14px] font-semibold">Begriff B</text>

      <rect x="640" y="108" width="170" height="64" rx="14" fill="#dcfce7" stroke="#22c55e" strokeWidth="2" />
      <text x="725" y="144" textAnchor="middle" className="fill-slate-900 text-[14px] font-semibold">Beleg</text>

      <rect x="840" y="108" width="120" height="64" rx="14" fill="#f0f9ff" stroke="#0ea5e9" strokeWidth="2" />
      <text x="900" y="144" textAnchor="middle" className="fill-slate-900 text-[14px] font-semibold">Ableitung</text>

      {showRelations ? (
        <>
          <line x1="250" y1="104" x2="340" y2="88" stroke="#38bdf8" strokeWidth="2.5" />
          <line x1="250" y1="104" x2="340" y2="200" stroke="#38bdf8" strokeWidth="2.5" />
          <line x1="530" y1="88" x2="640" y2="128" stroke="#38bdf8" strokeWidth="2.5" />
          <line x1="530" y1="200" x2="640" y2="152" stroke="#38bdf8" strokeWidth="2.5" />
        </>
      ) : null}

      {showEvidence ? <line x1="810" y1="140" x2="840" y2="140" stroke="#22c55e" strokeWidth="2.6" /> : null}
    </svg>
  );
}

function DecisionStateCanvas({
  showPath,
  simulateVariation,
}: {
  showPath: boolean;
  simulateVariation: boolean;
}): React.JSX.Element {
  return (
    <svg viewBox="0 0 1000 390" className="h-full w-full">
      <rect x="70" y="66" width="170" height="54" rx="12" fill="#f8fafc" stroke="#7dd3fc" strokeWidth="1.8" />
      <text x="155" y="98" textAnchor="middle" className="fill-slate-900 text-[13px] font-semibold">Frage A</text>

      {simulateVariation ? (
        <>
          <rect x="70" y="138" width="170" height="54" rx="12" fill="#f8fafc" stroke="#7dd3fc" strokeWidth="1.8" />
          <text x="155" y="170" textAnchor="middle" className="fill-slate-900 text-[13px] font-semibold">Frage B</text>
        </>
      ) : null}

      <rect x="360" y="88" width="170" height="56" rx="12" fill="#dbeafe" stroke="#38bdf8" strokeWidth="2" />
      <text x="445" y="121" textAnchor="middle" className="fill-slate-900 text-[13px] font-semibold">Begriffsraum</text>

      <rect x="620" y="88" width="170" height="56" rx="12" fill="#dcfce7" stroke="#22c55e" strokeWidth="2" />
      <text x="705" y="121" textAnchor="middle" className="fill-slate-900 text-[13px] font-semibold">Belegpfad</text>

      <rect x="860" y="88" width="110" height="56" rx="12" fill="#f0f9ff" stroke="#0ea5e9" strokeWidth="2" />
      <text x="915" y="121" textAnchor="middle" className="fill-slate-900 text-[13px] font-semibold">Entscheid</text>

      {showPath ? (
        <>
          <line x1="240" y1="94" x2="360" y2="116" stroke="#22d3ee" strokeWidth="3.2" />
          <line x1="530" y1="116" x2="620" y2="116" stroke="#22d3ee" strokeWidth="3.2" />
          <line x1="790" y1="116" x2="860" y2="116" stroke="#22d3ee" strokeWidth="3.2" />
          {simulateVariation ? <line x1="240" y1="166" x2="360" y2="116" stroke="#22d3ee" strokeWidth="3.2" /> : null}
        </>
      ) : null}

      <rect x="740" y="230" width="230" height="120" rx="14" fill="#0f172a" stroke="#334155" strokeWidth="1.6" />
      <text x="855" y="260" textAnchor="middle" className="fill-slate-200 text-[11px] uppercase tracking-[0.08em]">Version-Layer</text>
      <text x="768" y="290" className="fill-slate-300 text-[12px]">v1: stabiler Pfad</text>
      <text x="768" y="316" className="fill-slate-300 text-[12px]">v2: Frage variiert</text>
      <text x="768" y="342" className="fill-slate-300 text-[12px]">Kernaussage konsistent</text>
    </svg>
  );
}
