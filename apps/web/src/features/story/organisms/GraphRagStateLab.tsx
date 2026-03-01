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

import { AnimatePresence, motion } from "framer-motion";

function TextStateCanvas(): React.JSX.Element {
  return (
    <div className="relative h-full w-full p-8 font-sans">
      <div className="flex h-full items-center justify-between gap-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 rounded-2xl bg-slate-200/90 p-6 shadow-sm ring-1 ring-slate-300"
        >
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-700">Antworten</h4>
          <ul className="space-y-3">
            {[
              "plausible Zusammenfassung",
              "alternative Deutung",
              "offene Gewichtung",
              "uneinheitliche Schlussfolgerung"
            ].map((text, i) => (
              <motion.li 
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.15 }}
                className="flex items-center gap-3 text-sm text-slate-600 font-medium"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                {text}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="relative flex h-full items-center justify-center p-4"
        >
          <div className="absolute h-0.5 w-full bg-slate-500/30 border-t border-dashed border-slate-400" />
          <span className="relative bg-[#0b1021] px-4 text-sm font-medium text-slate-400">
            Keine explizite Beziehungslogik
          </span>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex-1 rounded-2xl bg-slate-200/90 p-6 shadow-sm ring-1 ring-slate-300"
        >
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-700">Quellenliste</h4>
          <ul className="space-y-3">
            {["Dokument A", "Dokument B", "Dokument C", "Dokument D"].map((doc, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                <div className="flex h-5 w-4 items-center justify-center rounded-[2px] border border-slate-400 bg-white">
                  <div className="h-2 w-2 border-t border-slate-400" />
                </div>
                {doc}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  );
}

const Node = ({ title, active, colorClass }: { title: string; active?: boolean; colorClass: string }) => (
  <motion.div 
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className={`relative flex items-center justify-center min-w-[130px] rounded-xl border px-4 py-3 text-sm font-bold shadow-sm backdrop-blur-md transition-all ${colorClass}`}
  >
    {active && (
      <motion.div
        layoutId="activeGlow"
        className="absolute inset-0 -z-10 rounded-xl bg-current opacity-30 blur-xl"
      />
    )}
    {title}
  </motion.div>
);

const Edge = ({ active, className }: { active?: boolean; className?: string }) => (
  <motion.div 
    initial={{ scaleX: 0 }}
    animate={{ scaleX: 1 }}
    className={`h-0.5 origin-left rounded-full ${active ? 'bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]' : 'bg-slate-700'} ${className || 'w-16'}`}
  />
);

function StructureStateCanvas({
  showRelations,
  showEvidence,
}: {
  showRelations: boolean;
  showEvidence: boolean;
}): React.JSX.Element {
  return (
    <div className="relative flex h-full w-full items-center justify-center p-8">
      <div className="flex items-center justify-center gap-2 w-full max-w-4xl">
        
        <div className="flex flex-col items-center z-10">
          <Node title="Kernfrage" colorClass="bg-slate-100/10 border-sky-400/50 text-white" />
        </div>

        <div className="flex flex-col justify-center gap-[4.5rem] relative -mx-4 h-full">
            <AnimatePresence>
              {showRelations && (
                <>
                  <Edge active className="w-20 absolute top-1/4 -rotate-12" />
                  <Edge active className="w-20 absolute bottom-1/4 rotate-12" />
                </>
              )}
            </AnimatePresence>
        </div>

        <div className="flex flex-col gap-6 z-10 pl-16">
          <Node title="Begriff A" colorClass="bg-sky-500/20 border-sky-400 text-sky-100" />
          <Node title="Begriff B" colorClass="bg-sky-500/20 border-sky-400 text-sky-100" />
        </div>

        <div className="flex flex-col justify-center gap-[4.5rem] relative -mx-4 h-full">
           <AnimatePresence>
             {showRelations && (
                <>
                  <Edge active className="w-20 absolute top-1/4 rotate-12" />
                  <Edge active className="w-20 absolute bottom-1/4 -rotate-12" />
                </>
             )}
           </AnimatePresence>
        </div>

        <div className="flex flex-col items-center z-10 pl-16">
          <Node title="Beleg" active={showEvidence} colorClass="bg-emerald-500/20 border-emerald-400 text-emerald-100" />
        </div>

        <div className="flex flex-col justify-center items-center px-4">
          <AnimatePresence>
            {showEvidence && <Edge active={true} className="w-12" />}
          </AnimatePresence>
        </div>

        <div className="flex flex-col items-center z-10">
          <Node active={showEvidence} title="Ableitung" colorClass="bg-indigo-500/20 border-indigo-400 text-indigo-100" />
        </div>

      </div>
    </div>
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
    <div className="relative flex h-full w-full items-center justify-between p-8">
      
      <div className="flex items-center gap-6 z-10">
        <div className="flex flex-col gap-4">
          <motion.div layout>
            <Node title="Frage A" colorClass="bg-slate-100/10 border-sky-400/50 text-white" />
          </motion.div>
          
          <AnimatePresence>
            {simulateVariation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Node title="Frage B" colorClass="bg-slate-100/10 border-sky-400/50 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-col justify-center gap-[1.5rem] relative">
            <AnimatePresence>
              {showPath && (
                 <motion.div 
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  className="h-0.5 w-16 origin-left rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                 />
              )}
            </AnimatePresence>
        </div>

        <Node title="Begriffsraum" active={showPath} colorClass="bg-sky-500/20 border-sky-400 text-sky-100" />
        
        <div className="px-2">
            <AnimatePresence>
                  {showPath && (
                    <motion.div 
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      className="h-0.5 w-12 origin-left rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                    />
                  )}
            </AnimatePresence>
        </div>

        <Node title="Belegpfad" active={showPath} colorClass="bg-emerald-500/20 border-emerald-400 text-emerald-100" />
        
        <div className="px-2">
            <AnimatePresence>
                  {showPath && (
                    <motion.div 
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      className="h-0.5 w-12 origin-left rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]"
                    />
                  )}
            </AnimatePresence>
        </div>

        <Node title="Entscheid" active={showPath} colorClass="bg-indigo-500/20 border-indigo-400 text-indigo-100" />
      </div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute bottom-6 right-6 rounded-xl border border-slate-700/50 bg-slate-900/80 p-5 backdrop-blur-md"
      >
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">Version-Layer</p>
        <div className="space-y-1.5 text-sm font-medium text-slate-300">
          <p className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-slate-500"/>v1: stabiler Pfad</p>
          <p className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-slate-500"/>v2: Frage variiert</p>
          <p className="mt-2 text-sky-400">Kernaussage konsistent</p>
        </div>
      </motion.div>
    </div>
  );
}
