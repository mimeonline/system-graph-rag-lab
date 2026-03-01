"use client";

import { useMemo } from "react";

type GraphRagNarrativeStageProps = {
  activeIndex: number;
};

const ACT_LABELS = [
  "Die Chaosphase",
  "Die Eskalation",
  "Der Wendepunkt",
  "Struktur entsteht",
  "Der Pfad",
  "Die Entscheidung",
  "Die Meta-Ebene",
];

const BASE_NODES = [
  { id: "a", x: 120, y: 210 },
  { id: "b", x: 240, y: 120 },
  { id: "c", x: 360, y: 240 },
  { id: "d", x: 520, y: 110 },
  { id: "e", x: 660, y: 250 },
  { id: "f", x: 820, y: 140 },
  { id: "g", x: 920, y: 280 },
  { id: "h", x: 1040, y: 180 },
  { id: "i", x: 300, y: 340 },
  { id: "j", x: 470, y: 320 },
  { id: "k", x: 760, y: 330 },
];

const CHAOS_EDGES: Array<[string, string]> = [
  ["a", "c"],
  ["a", "d"],
  ["b", "e"],
  ["c", "f"],
  ["c", "h"],
  ["d", "g"],
  ["e", "h"],
  ["f", "k"],
  ["g", "k"],
  ["i", "j"],
  ["j", "k"],
  ["b", "i"],
  ["d", "j"],
  ["f", "j"],
  ["e", "k"],
];

const STRUCTURE_NODES = [
  { id: "q", label: "Kernfrage", x: 200, y: 220 },
  { id: "k1", label: "Begriff A", x: 430, y: 140 },
  { id: "k2", label: "Begriff B", x: 430, y: 300 },
  { id: "b", label: "Beleg", x: 690, y: 220 },
  { id: "d", label: "Entscheidung", x: 930, y: 220 },
];

const STRUCTURE_EDGES: Array<[string, string, string]> = [
  ["q", "k1", "relevant"],
  ["q", "k2", "relevant"],
  ["k1", "b", "belegt"],
  ["k2", "b", "belegt"],
  ["b", "d", "ableitbar"],
];

function nodeById(id: string): { x: number; y: number } | null {
  const node = BASE_NODES.find((entry) => entry.id === id);
  return node ? { x: node.x, y: node.y } : null;
}

export function GraphRagNarrativeStage({ activeIndex }: GraphRagNarrativeStageProps): React.JSX.Element {
  const phase = Math.max(0, Math.min(activeIndex, 6));

  const beforeAfterMode = phase >= 3 ? "structured" : "chaos";
  const showFinalLayers = phase === 6;
  const showEscalationLayers = phase === 1;
  const showStableQuestions = phase === 5;

  const visibleChaosEdges = useMemo(() => {
    if (phase <= 0) return CHAOS_EDGES.slice(0, 9);
    if (phase === 1) return CHAOS_EDGES;
    return [] as Array<[string, string]>;
  }, [phase]);

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-slate-300/40 bg-slate-950 text-slate-100 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-700/70 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">GraphRAG Story</p>
          <span className="rounded-full border border-slate-600/80 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-slate-300">
            {ACT_LABELS[phase]}
          </span>
        </div>

        <div className="relative h-[420px] overflow-hidden rounded-b-2xl bg-[radial-gradient(circle_at_15%_20%,rgba(59,130,246,0.24),rgba(2,6,23,0.98))]">
          <svg viewBox="0 0 1120 420" className="h-full w-full">
            <defs>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {showEscalationLayers ? (
              <>
                <rect x="72" y="68" width="1000" height="280" rx="18" fill="rgba(59,130,246,0.08)" />
                <rect x="98" y="92" width="950" height="250" rx="18" fill="rgba(59,130,246,0.08)" />
                <rect x="126" y="116" width="900" height="220" rx="18" fill="rgba(59,130,246,0.08)" />
              </>
            ) : null}

            {visibleChaosEdges.map(([source, target], idx) => {
              const s = nodeById(source);
              const t = nodeById(target);
              if (!s || !t) return null;
              return (
                <line
                  key={`${source}-${target}`}
                  x1={s.x}
                  y1={s.y}
                  x2={t.x}
                  y2={t.y}
                  stroke="rgba(148,163,184,0.55)"
                  strokeWidth={phase === 1 ? 2.2 : 1.5}
                  className={phase <= 1 ? "animate-pulse" : ""}
                  style={{ animationDelay: `${idx * 80}ms` }}
                />
              );
            })}

            {(phase <= 1 ? BASE_NODES : []).map((node, idx) => (
              <circle
                key={node.id}
                cx={node.x}
                cy={node.y}
                r={phase === 1 ? 7 : 6}
                fill={phase === 1 ? "#94a3b8" : "#cbd5e1"}
                opacity={phase === 1 ? 0.9 : 0.75}
                className={phase <= 1 ? "animate-[pulse_2s_ease-in-out_infinite]" : ""}
                style={{ animationDelay: `${idx * 60}ms` }}
              />
            ))}

            {phase === 0 ? (
              <>
                <text x="152" y="82" className="fill-slate-300/80 text-[14px]">mehr Kontext</text>
                <text x="336" y="330" className="fill-slate-300/75 text-[13px]">widersprüchliche Sicht</text>
                <text x="702" y="78" className="fill-slate-300/70 text-[12px]">unklare Priorität</text>
                <text x="900" y="340" className="fill-slate-300/70 text-[13px]">offene Entscheidung</text>
              </>
            ) : null}

            {phase === 2 ? (
              <>
                {(BASE_NODES).map((node) => (
                  <circle key={`freeze-${node.id}`} cx={node.x} cy={node.y} r="5" fill="#334155" opacity="0.22" />
                ))}
                <circle cx="560" cy="210" r="10" fill="#93c5fd" filter="url(#glow)" />
                <text x="560" y="260" textAnchor="middle" className="fill-slate-100 text-[22px] font-semibold">
                  Kernfrage
                </text>
              </>
            ) : null}

            {phase >= 3
              ? STRUCTURE_EDGES.map(([source, target, type]) => {
                  const s = STRUCTURE_NODES.find((n) => n.id === source);
                  const t = STRUCTURE_NODES.find((n) => n.id === target);
                  if (!s || !t) return null;
                  const highlighted = phase >= 4 && ((source === "q" && target === "k1") || (source === "k1" && target === "b") || (source === "b" && target === "d"));
                  return (
                    <g key={`${source}-${target}`}>
                      <line
                        x1={s.x}
                        y1={s.y}
                        x2={t.x}
                        y2={t.y}
                        stroke={highlighted ? "#38bdf8" : "rgba(148,163,184,0.58)"}
                        strokeWidth={highlighted ? 4 : 2}
                        opacity={highlighted ? 1 : 0.8}
                      />
                      {phase === 3 ? (
                        <text x={(s.x + t.x) / 2} y={(s.y + t.y) / 2 - 8} textAnchor="middle" className="fill-slate-300 text-[11px] uppercase tracking-[0.08em]">
                          {type}
                        </text>
                      ) : null}
                    </g>
                  );
                })
              : null}

            {phase >= 3
              ? STRUCTURE_NODES.map((node) => {
                  const emphasis = node.id === "d" || node.id === "q";
                  return (
                    <g key={node.id}>
                      <rect
                        x={node.x - 72}
                        y={node.y - 30}
                        width="144"
                        height="60"
                        rx="14"
                        fill={emphasis ? "#f8fafc" : "#dbeafe"}
                        stroke={emphasis ? "#38bdf8" : "#7dd3fc"}
                        strokeWidth={emphasis ? 2.6 : 1.8}
                        opacity={phase === 6 ? 0.96 : 0.9}
                      />
                      <text x={node.x} y={node.y + 6} textAnchor="middle" className="fill-slate-900 text-[16px] font-semibold">
                        {node.label}
                      </text>
                    </g>
                  );
                })
              : null}

            {showStableQuestions ? (
              <>
                <rect x="80" y="116" width="152" height="44" rx="12" fill="#f8fafc" stroke="#7dd3fc" strokeWidth="1.8" />
                <text x="156" y="143" textAnchor="middle" className="fill-slate-900 text-[12px] font-semibold">Frage A</text>
                <rect x="80" y="174" width="152" height="44" rx="12" fill="#f8fafc" stroke="#7dd3fc" strokeWidth="1.8" />
                <text x="156" y="201" textAnchor="middle" className="fill-slate-900 text-[12px] font-semibold">Frage B</text>
                <line x1="232" y1="138" x2="358" y2="140" stroke="#38bdf8" strokeWidth="2.8" />
                <line x1="232" y1="196" x2="358" y2="300" stroke="#38bdf8" strokeWidth="2.8" />
              </>
            ) : null}
          </svg>

          {showFinalLayers ? (
            <div className="pointer-events-none absolute bottom-4 right-4 space-y-2 text-right">
              <div className="rounded-md border border-slate-500/70 bg-slate-900/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-slate-200">Systemrolle</div>
              <div className="rounded-md border border-slate-500/70 bg-slate-900/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-slate-200">Kontextpaket</div>
              <div className="rounded-md border border-slate-500/70 bg-slate-900/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-slate-200">Beziehungstypen</div>
              <div className="rounded-md border border-slate-500/70 bg-slate-900/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-slate-200">Belegpfade</div>
              <div className="rounded-md border border-slate-500/70 bg-slate-900/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-slate-200">Versionierung</div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="inline-flex rounded-full border border-slate-300 bg-white p-1">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
            beforeAfterMode === "chaos" ? "bg-slate-900 text-white" : "text-slate-600"
          }`}
        >
          Ohne Struktur
        </span>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
            beforeAfterMode === "structured" ? "bg-sky-600 text-white" : "text-slate-600"
          }`}
        >
          Mit Struktur
        </span>
      </div>
    </section>
  );
}
