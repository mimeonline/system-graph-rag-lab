import type { StoryChapterId } from "@/features/story/story-flow-model";

type StoryChapterAnimatedVisualProps = {
  chapterId: StoryChapterId;
};

export function StoryChapterAnimatedVisual({ chapterId }: StoryChapterAnimatedVisualProps): React.JSX.Element {
  return (
    <figure className="overflow-hidden rounded-xl border border-slate-200 bg-slate-950 p-1">
      <div className="h-[300px] overflow-hidden rounded-lg bg-[radial-gradient(ellipse_at_20%_30%,rgba(56,189,248,0.18),rgba(2,6,23,0.98)_70%)]">
        <svg
          key={chapterId}
          viewBox="0 0 640 280"
          className="h-full w-full"
          role="img"
          aria-label={`Animierte Visualisierung: ${chapterId}`}
        >
          {chapterId === "question" ? <QuestionAnimated /> : null}
          {chapterId === "retrieval" ? <RetrievalAnimated /> : null}
          {chapterId === "graph" ? <GraphAnimated /> : null}
          {chapterId === "synthesis" ? <SynthesisAnimated /> : null}
          {chapterId === "action" ? <ActionAnimated /> : null}
        </svg>
      </div>
    </figure>
  );
}

/* ─── Chapter 1: Frage ─── */
function QuestionAnimated(): React.JSX.Element {
  return (
    <>
      {/* Solution Horizon / Lösungshorizont */}
      <rect
        x="60" y="40" width="520" height="200" rx="16"
        fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="8 8" strokeOpacity="0.2"
        className="st-fade-in"
      />
      <text x="78" y="32" fill="#64748b" className="st-fade-in uppercase tracking-wider text-[10px]">
        Lösungshorizont
      </text>

      {/* Radiating circles */}
      <circle
        cx="320" cy="140" r="44"
        fill="none" stroke="#7dd3fc" strokeWidth="1.5" strokeOpacity="0.4"
        className="st-radiate"
      />
      <circle
        cx="320" cy="140" r="44"
        fill="none" stroke="#7dd3fc" strokeWidth="1" strokeOpacity="0.3"
        className="st-radiate" style={{ animationDelay: "1s" }}
      />

      {/* Central question node / Problemknoten */}
      <g className="st-pulse">
        <circle
          cx="320" cy="140" r="50"
          fill="rgba(14,165,233,0.15)" stroke="#0ea5e9" strokeWidth="2.5"
        />
        {/* Internal nodes / Question aspects */}
        <circle cx="305" cy="125" r="5" fill="#38bdf8" className="st-fade-in" style={{ animationDelay: "0.5s" }} />
        <circle cx="340" cy="135" r="4" fill="#38bdf8" className="st-fade-in" style={{ animationDelay: "0.7s" }} />
        <circle cx="315" cy="155" r="6" fill="#38bdf8" className="st-fade-in" style={{ animationDelay: "0.9s" }} />
        
        <text x="320" y="138" textAnchor="middle" fill="#e0f2fe" className="text-[13px] font-bold tracking-tight">
          PROBLEM-
        </text>
        <text x="320" y="152" textAnchor="middle" fill="#e0f2fe" className="text-[13px] font-bold tracking-tight">
          KNOTEN
        </text>
      </g>

      {/* Annotation labels */}
      <g className="st-fade-in" style={{ animationDelay: "1.2s" }}>
        <text x="440" y="90" fill="#38bdf8" className="text-[11px] font-semibold">Kontext-Annahme</text>
        <line x1="435" y1="95" x2="365" y2="120" stroke="#0ea5e9" strokeWidth="1.2" strokeDasharray="3 3" strokeOpacity="0.4" />
      </g>
      <g className="st-fade-in" style={{ animationDelay: "1.8s" }}>
        <text x="120" y="200" fill="#94a3b8" className="text-[11px]">Vage Ausgangslage</text>
        <path d="M120 185 Q180 180 275 155" fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.2" />
      </g>
      
      <text x="320" y="225" textAnchor="middle" fill="#64748b" className="st-fade-in text-[10px]" style={{ animationDelay: "2s" }}>
        Explizite Definition von Ziel & Systemgrenze
      </text>
    </>
  );
}

/* ─── Chapter 2: Retrieval ─── */
function RetrievalAnimated(): React.JSX.Element {
  const allNodes = [
    { x: 100, y: 80, r: 16, label: "Doku A", fill: "#475569", filtered: true, delay: 0 },
    { x: 100, y: 140, r: 20, label: "Kontext 1", fill: "#0ea5e9", filtered: false, delay: 0.2 },
    { x: 100, y: 200, r: 16, label: "Doku C", fill: "#475569", filtered: true, delay: 0.4 },
    { x: 280, y: 110, r: 24, label: "Kontext 2", fill: "#22d3ee", filtered: false, delay: 0.8 },
    { x: 280, y: 180, r: 18, label: "Doku D", fill: "#475569", filtered: true, delay: 1.0 },
    { x: 480, y: 140, r: 28, label: "Kontext 3", fill: "#0ea5e9", filtered: false, delay: 1.4 },
  ];

  return (
    <>
      {/* Background container */}
      <rect x="40" y="40" width="560" height="200" rx="16" fill="rgba(15,23,42,0.4)" stroke="rgba(148,163,184,0.15)" />

      {/* Filter Metaphor Line */}
      <g className="st-fade-in" style={{ animationDelay: "0.5s" }}>
        <line x1="380" y1="50" x2="380" y2="230" stroke="#38bdf8" strokeWidth="2" strokeDasharray="6 4" strokeOpacity="0.4" />
        <rect x="365" y="80" width="30" height="120" rx="4" fill="rgba(56,189,248,0.05)" stroke="rgba(56,189,248,0.2)" />
        <text x="385" y="65" fill="#38bdf8" className="text-[10px] font-bold uppercase tracking-wider">Ranking-Filter</text>
      </g>

      {/* Vector Search Label */}
      <text x="60" y="32" fill="#64748b" className="st-fade-in text-[10px] uppercase tracking-widest">
        Vektor-Suche im Wissensraum
      </text>

      {/* Nodes passing through */}
      {allNodes.map((node) => (
        <g key={`${node.x}-${node.y}`} className="st-grow-in" style={{ animationDelay: `${node.delay}s` }}>
          <circle 
            cx={node.x} cy={node.y} r={node.r} 
            fill={node.fill} 
            fillOpacity={node.filtered ? "0.3" : "0.9"} 
            stroke={node.filtered ? "none" : "#fff"}
            strokeWidth={node.filtered ? 0 : 1.5}
          />
          <text 
            x={node.x} y={node.y + 4} 
            textAnchor="middle" 
            fill={node.filtered ? "#94a3b8" : "#020617"}
            className="text-[9px] font-bold"
          >
            {node.filtered ? "" : node.label}
          </text>
          {!node.filtered && (
             <text x={node.x} y={node.y + node.r + 12} textAnchor="middle" fill="#38bdf8" className="text-[8px] font-bold">RELEVANT</text>
          )}
        </g>
      ))}

      {/* Connection lines */}
      <g className="st-fade-in" style={{ animationDelay: "2s" }}>
        <path d="M120 140 L256 110 M304 110 L452 140" stroke="#38bdf8" strokeWidth="2" strokeDasharray="5 5" strokeOpacity="0.4" fill="none" />
      </g>

      <text x="500" y="225" textAnchor="middle" fill="#64748b" className="st-fade-in text-[10px]" style={{ animationDelay: "2.2s" }}>
        Nur validierte Quellen gelangen in den Graphen
      </text>
    </>
  );
}

/* ─── Chapter 3: Graph ─── */
function GraphAnimated(): React.JSX.Element {
  const nodes = [
    { id: "a", x: 120, y: 140, r: 24, fill: "#bae6fd", label: "PROBLEM", pulse: true },
    { id: "b1", x: 260, y: 70, r: 18, fill: "#a7f3d0", label: "Konzept 1" },
    { id: "b2", x: 260, y: 110, r: 16, fill: "#a7f3d0", label: "Konzept 2" },
    { id: "c", x: 260, y: 200, r: 20, fill: "#c4b5fd", label: "Konzept 3" },
    { id: "d", x: 420, y: 80, r: 22, fill: "#fde68a", label: "BELEG A", pulse: true },
    { id: "e", x: 420, y: 160, r: 18, fill: "#fed7aa", label: "Trade-off" },
    { id: "f", x: 420, y: 220, r: 16, fill: "#fde68a", label: "BELEG B" },
    { id: "res", x: 550, y: 140, r: 26, fill: "#bbf7d0", label: "ERGEBNIS", pulse: true },
  ];

  const edges = [
    { x1: 144, y1: 135, x2: 242, y2: 75, color: "#0ea5e9", label: "Ursache", delay: 0.8 },
    { x1: 144, y1: 145, x2: 242, y2: 105, color: "#0ea5e9", label: "", delay: 1.0 },
    { x1: 144, y1: 140, x2: 240, y2: 200, color: "#a78bfa", label: "Konflikt", delay: 1.2 },
    { x1: 278, y1: 70, x2: 398, y2: 75, color: "#22c55e", label: "stützt", delay: 1.5 },
    { x1: 278, y1: 200, x2: 402, y2: 165, color: "#f59e0b", label: "Trade-off", delay: 1.8 },
    { x1: 442, y1: 85, x2: 524, y2: 130, color: "#22c55e", label: "validiert", delay: 2.1 },
    { x1: 438, y1: 165, x2: 524, y2: 150, color: "#0ea5e9", label: "", delay: 2.4 },
  ];

  return (
    <>
      <g className="st-fade-in" style={{ animationDelay: "0.3s" }}>
        <rect x="230" y="50" width="60" height="85" rx="8" fill="rgba(167,243,208,0.05)" stroke="rgba(167,243,208,0.2)" strokeDasharray="3 3" />
        <text x="260" y="45" textAnchor="middle" fill="#34d399" className="text-[8px] uppercase font-bold">Themen-Cluster</text>
      </g>

      {nodes.map((node, i) => (
        <g key={node.id} className={`st-fade-in ${node.pulse ? "st-pulse" : ""}`} style={{ animationDelay: `${i * 0.1}s` }}>
          <circle cx={node.x} cy={node.y} r={node.r} fill={node.fill} fillOpacity="0.9" />
          <text x={node.x} y={node.y + 4} textAnchor="middle" fill="#0f172a" className="text-[9px] font-bold">
            {node.label}
          </text>
        </g>
      ))}

      {edges.map((edge, i) => {
        const length = Math.sqrt((edge.x2 - edge.x1) ** 2 + (edge.y2 - edge.y1) ** 2);
        return (
          <g key={`edge-${i}`}>
            <line
              x1={edge.x1} y1={edge.y1} x2={edge.x2} y2={edge.y2}
              stroke={edge.color} strokeWidth="2.5"
              strokeDasharray="1000"
              strokeDashoffset="1000"
              className="st-draw"
              style={{ animationDelay: `${edge.delay}s` }}
            />
            {edge.label ? (
              <text
                x={(edge.x1 + edge.x2) / 2}
                y={(edge.y1 + edge.y2) / 2 - 8}
                textAnchor="middle"
                fill="#7dd3fc"
                className="st-fade-in text-[9px] font-semibold"
                style={{ animationDelay: `${edge.delay + 0.3}s` }}
              >
                {edge.label}
              </text>
            ) : null}
          </g>
        );
      })}

      <text x="320" y="255" textAnchor="middle" fill="#64748b" className="st-fade-in text-[10px]" style={{ animationDelay: "2.8s" }}>
        Beziehungen schaffen Struktur: Ursache-Wirkung-Netz statt Textwüste
      </text>
    </>
  );
}

/* ─── Chapter 4: Synthese ─── */
function SynthesisAnimated(): React.JSX.Element {
  const pathNodes = [
    { x: 80, y: 140, label: "FRAGE", type: "start", delay: 0 },
    { x: 210, y: 100, label: "KONZEPT", type: "step", delay: 0.4 },
    { x: 350, y: 140, label: "BELEG", type: "step", delay: 0.8 },
    { x: 480, y: 100, label: "BEZIEHUNG", type: "step", delay: 1.2 },
    { x: 580, y: 140, label: "SCHLUSS", type: "end", delay: 1.6 },
  ];

  const pathSegments = [
    { x1: 136, y1: 140, x2: 154, y2: 100, delay: 0.3 },
    { x1: 266, y1: 100, x2: 294, y2: 140, delay: 0.7 },
    { x1: 406, y1: 140, x2: 424, y2: 100, delay: 1.1 },
    { x1: 536, y1: 100, x2: 524, y2: 140, delay: 1.5 },
  ];

  return (
    <>
      <g className="st-fade-in" style={{ animationDelay: "0.5s" }}>
        <path d="M80 160 Q180 200 350 190" stroke="#ef4444" strokeWidth="1.5" fill="none" strokeDasharray="4 4" strokeOpacity="0.2" />
        <text x="220" y="210" fill="rgba(239,68,68,0.4)" className="text-[9px] italic">Widerspruch erkannt</text>
        <path d="M210 120 L300 200" stroke="#94a3b8" strokeWidth="1" fill="none" strokeDasharray="3 3" strokeOpacity="0.15" />
        <text x="310" y="205" fill="#475569" className="text-[8px]">Unzureichende Evidenz</text>
      </g>

      {pathSegments.map((seg, i) => (
        <line
          key={`seg-${i}`}
          x1={seg.x1} y1={seg.y1} x2={seg.x2} y2={seg.y2}
          stroke="#06b6d4" strokeWidth="4"
          strokeDasharray="1000"
          strokeDashoffset="1000"
          className="st-draw"
          style={{ animationDelay: `${seg.delay}s`, filter: "drop-shadow(0 0 4px rgba(6,182,212,0.4))" }}
        />
      ))}

      {pathNodes.map((node) => (
        <g key={node.label} className="st-fade-in" style={{ animationDelay: `${node.delay}s` }}>
          <rect
            x={node.x - 50} y={node.y - 20} width="100" height="40" rx="10"
            fill={node.type === "start" || node.type === "end" ? "rgba(8,145,178,0.3)" : "rgba(15,23,42,0.8)"}
            stroke={node.type === "end" ? "#34d399" : "#06b6d4"} strokeWidth="2"
          />
          <text x={node.x} y={node.y + 5} textAnchor="middle" fill="#e0f2fe" className="text-[11px] font-bold tracking-tight">
            {node.label}
          </text>
        </g>
      ))}

      <g className="st-fade-in" style={{ animationDelay: "1s" }}>
         <circle cx="170" cy="115" r="3" fill="#06b6d4" />
         <text x="178" y="118" fill="#06b6d4" className="text-[9px] font-bold">PRÜFUNG</text>
      </g>
      <g className="st-fade-in" style={{ animationDelay: "2s" }}>
         <circle cx="530" cy="115" r="3" fill="#34d399" />
         <text x="538" y="118" fill="#34d399" className="text-[9px] font-bold">VALIDIERT</text>
      </g>

      <text x="320" y="245" textAnchor="middle" fill="#64748b" className="st-fade-in text-[10px]" style={{ animationDelay: "2.5s" }}>
        Der Graph liefert die Argumentationskette – die Synthese prüft deren Konsistenz
      </text>
    </>
  );
}

/* ─── Chapter 5: Handlung ─── */
function ActionAnimated(): React.JSX.Element {
  const versions = [
    { y: 76, label: "v1.2", status: "OPERATIV", active: true, delay: 1.4 },
    { y: 116, label: "v1.1", status: "ARCHIVIERT", active: false, delay: 1.7 },
    { y: 156, label: "v1.0", status: "ARCHIVIERT", active: false, delay: 2.0 },
  ];

  return (
    <>
      <rect x="30" y="40" width="340" height="200" rx="14" fill="rgba(15,23,42,0.4)" stroke="rgba(148,163,184,0.15)" />
      <text x="45" y="32" fill="#64748b" className="text-[10px] uppercase tracking-wider">Entscheidungs-Zustand</text>

      <g className="st-fade-in" style={{ animationDelay: "0.2s" }}>
        <circle cx="100" cy="100" r="18" fill="#38bdf8" fillOpacity="0.6" />
        <circle cx="180" cy="160" r="18" fill="#22d3ee" fillOpacity="0.6" />
        <circle cx="260" cy="110" r="22" fill="#22c55e" fillOpacity="0.85" />
      </g>

      <g className="st-fade-in" style={{ animationDelay: "0.5s" }}>
        <line x1="118" y1="108" x2="162" y2="152" stroke="rgba(125,211,252,0.3)" strokeWidth="2" />
        <line x1="198" y1="152" x2="242" y2="118" stroke="rgba(125,211,252,0.3)" strokeWidth="2" />
      </g>

      <g className="st-radiate" style={{ transformOrigin: "260px 110px" }}>
        <circle cx="260" cy="110" r="28" fill="none" stroke="#34d399" strokeWidth="2" strokeDasharray="4 3" />
      </g>
      <text x="260" y="70" textAnchor="middle" fill="#34d399" className="st-fade-in text-[10px] font-bold" style={{ animationDelay: "1s" }}>SNAPSHOT</text>

      <g className="st-fade-in" style={{ animationDelay: "2.2s" }}>
         <path d="M288 110 Q350 110 420 91" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="5 5" markerEnd="url(#arrowhead)" />
         <text x="350" y="95" textAnchor="middle" fill="#0ea5e9" className="text-[9px] font-bold">TRANSFORM</text>
      </g>

      <rect x="420" y="40" width="190" height="200" rx="14" fill="rgba(15,23,42,0.4)" stroke="rgba(148,163,184,0.15)" className="st-fade-in" style={{ animationDelay: "1.2s" }} />
      <text x="440" y="62" fill="#94a3b8" className="st-fade-in text-[10px] font-bold uppercase tracking-wider" style={{ animationDelay: "1.2s" }}>Version-Layer</text>

      {versions.map((v) => (
        <g key={v.label} className="st-slide-right" style={{ animationDelay: `${v.delay}s` }}>
          <rect
            x="440" y={v.y} width="150" height="34" rx="8"
            fill={v.active ? "rgba(8,145,178,0.2)" : "rgba(15,23,42,1)"}
            stroke={v.active ? "#0ea5e9" : "#334155"}
            strokeWidth={v.active ? "1.5" : "1"}
          />
          <text x="455" y={v.y + 21} fill={v.active ? "#e0f2fe" : "#64748b"} className="text-[11px] font-bold">
            {v.label}
          </text>
          <text x="580" y={v.y + 21} textAnchor="end" fill={v.active ? "#38bdf8" : "#475569"} className="text-[9px] font-bold">
            {v.status}
          </text>
          {v.active && (
            <circle cx="584" cy={v.y + 17} r="3" fill="#38bdf8" className="st-v-pulse" />
          )}
        </g>
      ))}

      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#0ea5e9" />
        </marker>
      </defs>

      <text x="495" y="255" textAnchor="middle" fill="#64748b" className="st-fade-in text-[10px]" style={{ animationDelay: "2.5s" }}>
        Stabile Entscheidungs-Zustände statt flüchtiger Antworten
      </text>
    </>
  );
}


