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
      {/* Radiating circles */}
      <circle
        cx="320" cy="140" r="44"
        fill="none" stroke="rgba(125,211,252,0.4)" strokeWidth="1.5"
        style={{ animation: "story-radiate 3s ease-out infinite" }}
      />
      <circle
        cx="320" cy="140" r="44"
        fill="none" stroke="rgba(125,211,252,0.3)" strokeWidth="1"
        style={{ animation: "story-radiate 3s ease-out 1s infinite" }}
      />
      <circle
        cx="320" cy="140" r="44"
        fill="none" stroke="rgba(125,211,252,0.2)" strokeWidth="1"
        style={{ animation: "story-radiate 3s ease-out 2s infinite" }}
      />

      {/* Dashed boundary circles */}
      <circle
        cx="320" cy="140" r="90"
        fill="none" stroke="rgba(148,163,184,0.25)" strokeWidth="1.5" strokeDasharray="4 6"
        style={{ opacity: 0, animation: "story-fade-in 1s ease-out 0.5s forwards" }}
      />
      <circle
        cx="320" cy="140" r="125"
        fill="none" stroke="rgba(148,163,184,0.15)" strokeWidth="1" strokeDasharray="3 8"
        style={{ opacity: 0, animation: "story-fade-in 1s ease-out 1s forwards" }}
      />

      {/* Central question node */}
      <circle
        cx="320" cy="140" r="42"
        fill="rgba(14,165,233,0.15)" stroke="#0ea5e9" strokeWidth="2"
        style={{ animation: "story-pulse 3s ease-in-out infinite" }}
      />
      <text x="320" y="137" textAnchor="middle" className="fill-sky-200 text-[15px] font-semibold">
        Kern-
      </text>
      <text x="320" y="154" textAnchor="middle" className="fill-sky-200 text-[15px] font-semibold">
        frage
      </text>

      {/* Annotation labels – fade in */}
      <g style={{ opacity: 0, animation: "story-fade-in 0.8s ease-out 0.8s forwards" }}>
        <text x="432" y="94" className="fill-slate-400 text-[11px]">implizite Annahmen</text>
        <line x1="424" y1="97" x2="380" y2="118" stroke="rgba(148,163,184,0.3)" strokeWidth="1" strokeDasharray="3 3" />
      </g>
      <g style={{ opacity: 0, animation: "story-fade-in 0.8s ease-out 1.2s forwards" }}>
        <text x="148" y="190" className="fill-slate-400 text-[11px]">Ziel &amp; Grenze</text>
        <line x1="216" y1="186" x2="270" y2="162" stroke="rgba(148,163,184,0.3)" strokeWidth="1" strokeDasharray="3 3" />
      </g>
      <g style={{ opacity: 0, animation: "story-fade-in 0.8s ease-out 1.6s forwards" }}>
        <text x="400" y="216" className="fill-slate-400 text-[11px]">noch keine Relationen</text>
      </g>
    </>
  );
}

/* ─── Chapter 2: Retrieval ─── */
function RetrievalAnimated(): React.JSX.Element {
  const nodes = [
    { x: 130, y: 120, r: 28, label: "hoch", fill: "#22d3ee", delay: 0 },
    { x: 260, y: 170, r: 20, label: "mittel", fill: "#38bdf8", delay: 0.3 },
    { x: 360, y: 95, r: 28, label: "hoch", fill: "#22d3ee", delay: 0.6 },
    { x: 480, y: 160, r: 14, label: "niedrig", fill: "#475569", delay: 0.9 },
    { x: 560, y: 110, r: 20, label: "mittel", fill: "#38bdf8", delay: 1.2 },
  ];

  return (
    <>
      {/* Background container */}
      <rect x="60" y="40" width="520" height="200" rx="16" fill="rgba(15,23,42,0.4)" stroke="rgba(148,163,184,0.15)" />

      {/* Title */}
      <text x="78" y="32" className="fill-slate-400 text-[11px]" style={{ opacity: 0, animation: "story-fade-in 0.6s ease-out forwards" }}>
        Priorisierung statt Vollständigkeit
      </text>

      {/* Context nodes – grow in with stagger */}
      {nodes.map((node) => (
        <g key={`${node.x}-${node.y}`} style={{ transformOrigin: `${node.x}px ${node.y}px`, opacity: 0, animation: `story-grow-in 0.5s cubic-bezier(0.34,1.56,0.64,1) ${node.delay}s forwards` }}>
          <circle cx={node.x} cy={node.y} r={node.r} fill={node.fill} opacity="0.85" />
          <text x={node.x} y={node.y + 4} textAnchor="middle" className="fill-slate-950 text-[10px] font-bold">
            {node.label}
          </text>
        </g>
      ))}

      {/* Weight indicator lines – fade in late */}
      <g style={{ opacity: 0, animation: "story-fade-in 0.8s ease-out 1.5s forwards" }}>
        {/* Connection hints between high-priority nodes */}
        <line x1="158" y1="120" x2="332" y2="95" stroke="rgba(34,211,238,0.25)" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="260" y1="170" x2="360" y2="95" stroke="rgba(56,189,248,0.2)" strokeWidth="1" strokeDasharray="4 4" />
      </g>

      {/* Dimmed indicator for low-priority */}
      <g style={{ opacity: 0, animation: "story-fade-in 0.6s ease-out 1.8s forwards" }}>
        <text x="480" y="190" textAnchor="middle" className="fill-slate-500 text-[9px]">zurückgestellt</text>
      </g>
    </>
  );
}

/* ─── Chapter 3: Graph ─── */
function GraphAnimated(): React.JSX.Element {
  const nodes = [
    { id: "a", x: 140, y: 140, r: 22, fill: "#bae6fd", label: "Frage" },
    { id: "b", x: 280, y: 80, r: 20, fill: "#a7f3d0", label: "Konzept A" },
    { id: "c", x: 280, y: 200, r: 20, fill: "#c4b5fd", label: "Konzept B" },
    { id: "d", x: 420, y: 110, r: 20, fill: "#fde68a", label: "Beleg" },
    { id: "e", x: 420, y: 190, r: 18, fill: "#fed7aa", label: "Trade-off" },
    { id: "f", x: 540, y: 140, r: 22, fill: "#bbf7d0", label: "Ergebnis" },
  ];

  const edges = [
    { x1: 162, y1: 134, x2: 260, y2: 84, color: "#0ea5e9", label: "Ursache", delay: 0.8 },
    { x1: 162, y1: 146, x2: 260, y2: 196, color: "#a78bfa", label: "Trade-off", delay: 1.1 },
    { x1: 300, y1: 80, x2: 400, y2: 110, color: "#22c55e", label: "Evidenz", delay: 1.4 },
    { x1: 300, y1: 200, x2: 400, y2: 190, color: "#f59e0b", label: "", delay: 1.7 },
    { x1: 440, y1: 110, x2: 520, y2: 136, color: "#22c55e", label: "", delay: 2.0 },
    { x1: 440, y1: 190, x2: 520, y2: 144, color: "#a78bfa", label: "", delay: 2.3 },
  ];

  return (
    <>
      {/* Nodes – present from start with fade */}
      {nodes.map((node, i) => (
        <g key={node.id} style={{ opacity: 0, animation: `story-fade-in 0.4s ease-out ${i * 0.1}s forwards` }}>
          <circle cx={node.x} cy={node.y} r={node.r} fill={node.fill} opacity="0.85" />
          <text x={node.x} y={node.y + 4} textAnchor="middle" className="fill-slate-900 text-[9px] font-bold">
            {node.label}
          </text>
        </g>
      ))}

      {/* Edges – draw in sequentially */}
      {edges.map((edge, i) => {
        const length = Math.sqrt((edge.x2 - edge.x1) ** 2 + (edge.y2 - edge.y1) ** 2);
        return (
          <g key={`edge-${i}`}>
            <line
              x1={edge.x1} y1={edge.y1} x2={edge.x2} y2={edge.y2}
              stroke={edge.color} strokeWidth="2.5"
              strokeDasharray={length}
              strokeDashoffset={length}
              style={{ animation: `story-draw-edge 0.6s ease-out ${edge.delay}s forwards` }}
            />
            {edge.label ? (
              <text
                x={(edge.x1 + edge.x2) / 2}
                y={(edge.y1 + edge.y2) / 2 - 8}
                textAnchor="middle"
                className="fill-slate-300 text-[9px]"
                style={{ opacity: 0, animation: `story-fade-in 0.4s ease-out ${edge.delay + 0.3}s forwards` }}
              >
                {edge.label}
              </text>
            ) : null}
          </g>
        );
      })}

      {/* Legend */}
      <g style={{ opacity: 0, animation: "story-fade-in 0.6s ease-out 2.8s forwards" }}>
        <circle cx="68" cy="248" r="4" fill="#0ea5e9" />
        <text x="78" y="252" className="fill-slate-400 text-[9px]">Ursache</text>
        <circle cx="140" cy="248" r="4" fill="#a78bfa" />
        <text x="150" y="252" className="fill-slate-400 text-[9px]">Trade-off</text>
        <circle cx="220" cy="248" r="4" fill="#22c55e" />
        <text x="230" y="252" className="fill-slate-400 text-[9px]">Evidenz</text>
      </g>
    </>
  );
}

/* ─── Chapter 4: Synthese ─── */
function SynthesisAnimated(): React.JSX.Element {
  const pathNodes = [
    { x: 80, y: 140, label: "Frage", delay: 0 },
    { x: 210, y: 100, label: "Konzept", delay: 0.4 },
    { x: 350, y: 140, label: "Beziehung", delay: 0.8 },
    { x: 480, y: 100, label: "Beleg", delay: 1.2 },
    { x: 580, y: 140, label: "Schluss", delay: 1.6 },
  ];

  const pathSegments = [
    { x1: 136, y1: 140, x2: 154, y2: 100, delay: 0.3 },
    { x1: 266, y1: 100, x2: 294, y2: 140, delay: 0.7 },
    { x1: 406, y1: 140, x2: 424, y2: 100, delay: 1.1 },
    { x1: 536, y1: 100, x2: 524, y2: 140, delay: 1.5 },
  ];

  return (
    <>
      {/* Alternative paths – dim, dashed, always visible */}
      <path
        d="M80 180 Q180 220 350 210 Q480 200 580 180"
        stroke="rgba(148,163,184,0.2)" strokeWidth="1.5" fill="none" strokeDasharray="5 6"
        style={{ opacity: 0, animation: "story-fade-in 0.8s ease-out 0.5s forwards" }}
      />
      <path
        d="M80 100 Q200 50 350 70"
        stroke="rgba(148,163,184,0.15)" strokeWidth="1" fill="none" strokeDasharray="4 6"
        style={{ opacity: 0, animation: "story-fade-in 0.8s ease-out 0.8s forwards" }}
      />

      {/* Main path segments – light up sequentially */}
      {pathSegments.map((seg, i) => {
        const length = Math.sqrt((seg.x2 - seg.x1) ** 2 + (seg.y2 - seg.y1) ** 2);
        return (
          <line
            key={`seg-${i}`}
            x1={seg.x1} y1={seg.y1} x2={seg.x2} y2={seg.y2}
            stroke="#06b6d4" strokeWidth="3"
            strokeDasharray={length}
            strokeDashoffset={length}
            style={{ animation: `story-draw-edge 0.4s ease-out ${seg.delay}s forwards` }}
          />
        );
      })}

      {/* Path nodes – appear sequentially */}
      {pathNodes.map((node) => (
        <g key={node.label} style={{ opacity: 0, animation: `story-fade-in 0.4s ease-out ${node.delay}s forwards` }}>
          <rect
            x={node.x - 48} y={node.y - 20}
            width="96" height="40" rx="10"
            fill="rgba(8,145,178,0.15)" stroke="#06b6d4" strokeWidth="1.5"
          />
          <text x={node.x} y={node.y + 5} textAnchor="middle" className="fill-sky-200 text-[12px] font-semibold">
            {node.label}
          </text>
        </g>
      ))}

      {/* Label */}
      <text
        x="80" y="40"
        className="fill-slate-400 text-[11px]"
        style={{ opacity: 0, animation: "story-fade-in 0.6s ease-out 0.2s forwards" }}
      >
        Markierter Ableitungspfad
      </text>
      <text
        x="350" y="240"
        textAnchor="middle"
        className="fill-slate-500 text-[9px]"
        style={{ opacity: 0, animation: "story-fade-in 0.6s ease-out 2s forwards" }}
      >
        alternative Pfade bleiben sichtbar
      </text>
    </>
  );
}

/* ─── Chapter 5: Handlung ─── */
function ActionAnimated(): React.JSX.Element {
  const versions = [
    { y: 76, label: "v1  stabiler Pfad", active: true, delay: 1.4 },
    { y: 116, label: "v2  Fragevariation", active: false, delay: 1.7 },
    { y: 156, label: "v3  Trade-off-Pfad", active: false, delay: 2.0 },
  ];

  return (
    <>
      {/* Graph area */}
      <rect x="40" y="40" width="340" height="200" rx="14" fill="rgba(15,23,42,0.4)" stroke="rgba(148,163,184,0.15)" />

      {/* Graph nodes */}
      <g style={{ opacity: 0, animation: "story-fade-in 0.4s ease-out 0.2s forwards" }}>
        <circle cx="120" cy="100" r="18" fill="#38bdf8" opacity="0.85" />
        <circle cx="210" cy="155" r="18" fill="#22d3ee" opacity="0.85" />
        <circle cx="290" cy="110" r="18" fill="#22c55e" opacity="0.85" />
        <circle cx="330" cy="185" r="16" fill="#f59e0b" opacity="0.7" />
      </g>

      {/* Edges */}
      <g style={{ opacity: 0, animation: "story-fade-in 0.4s ease-out 0.5s forwards" }}>
        <line x1="138" y1="100" x2="192" y2="155" stroke="#7dd3fc" strokeWidth="2.5" />
        <line x1="228" y1="155" x2="272" y2="110" stroke="#7dd3fc" strokeWidth="2.5" />
        <line x1="308" y1="110" x2="314" y2="185" stroke="#86efac" strokeWidth="2.5" />
      </g>

      {/* Alternative path – dashed */}
      <path
        d="M210 155 C240 200,300 210,330 185"
        stroke="rgba(148,163,184,0.4)" strokeWidth="1.5" fill="none" strokeDasharray="5 5"
        style={{ opacity: 0, animation: "story-fade-in 0.6s ease-out 0.8s forwards" }}
      />

      {/* Decision state marker */}
      <g style={{ opacity: 0, animation: "story-fade-in 0.6s ease-out 1s forwards" }}>
        <circle cx="290" cy="110" r="24" fill="none" stroke="#22c55e" strokeWidth="2" strokeDasharray="4 3" />
        <text x="290" y="78" textAnchor="middle" className="fill-emerald-400 text-[9px] font-semibold">Entscheidung</text>
      </g>

      {/* Version layer panel */}
      <rect x="420" y="40" width="180" height="200" rx="14" fill="rgba(15,23,42,0.4)" stroke="rgba(148,163,184,0.15)"
        style={{ opacity: 0, animation: "story-fade-in 0.4s ease-out 1.2s forwards" }}
      />
      <text x="440" y="62" className="fill-slate-300 text-[10px] font-semibold"
        style={{ opacity: 0, animation: "story-fade-in 0.4s ease-out 1.3s forwards" }}
      >
        Version-Layer
      </text>

      {/* Version cards – slide in from right */}
      {versions.map((v) => (
        <g key={v.label} style={{ opacity: 0, animation: `story-slide-in-right 0.4s ease-out ${v.delay}s forwards` }}>
          <rect
            x="440" y={v.y} width="140" height="30" rx="6"
            fill={v.active ? "rgba(8,145,178,0.2)" : "#0f172a"}
            stroke={v.active ? "#0ea5e9" : "#475569"}
            strokeWidth={v.active ? "1.5" : "1"}
          />
          <text
            x="510" y={v.y + 19}
            textAnchor="middle"
            className={v.active ? "fill-sky-200 text-[10px] font-semibold" : "fill-slate-400 text-[10px]"}
            style={v.active ? { animation: "story-version-pulse 2.5s ease-in-out 2.5s infinite" } : undefined}
          >
            {v.label}
          </text>
        </g>
      ))}
    </>
  );
}
