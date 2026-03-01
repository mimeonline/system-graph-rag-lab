import type { StoryChapterId } from "@/features/story/story-flow-model";

type StoryChapterSvgVisualProps = {
  chapterId: StoryChapterId;
};

export function StoryChapterSvgVisual({ chapterId }: StoryChapterSvgVisualProps): React.JSX.Element {
  return (
    <div className="rounded-xl border border-slate-300/80 bg-slate-950 p-3">
      <div className="h-[320px] overflow-hidden rounded-lg bg-[radial-gradient(circle_at_15%_18%,rgba(56,189,248,0.24),rgba(2,6,23,0.98))]">
        <svg viewBox="0 0 960 320" className="h-full w-full" role="img" aria-label={`Visualisierung ${chapterId}`}>
          {chapterId === "question" ? <QuestionVisual /> : null}
          {chapterId === "retrieval" ? <RetrievalVisual /> : null}
          {chapterId === "synthesis" ? <SynthesisVisual /> : null}
          {chapterId === "action" ? <ActionVisual /> : null}
        </svg>
      </div>
    </div>
  );
}

function QuestionVisual(): React.JSX.Element {
  return (
    <>
      <circle cx="480" cy="160" r="54" fill="#dbeafe" stroke="#38bdf8" strokeWidth="3" />
      <text x="480" y="166" textAnchor="middle" className="fill-slate-900 text-[20px] font-semibold">
        Frage
      </text>
      <circle cx="480" cy="160" r="102" fill="none" stroke="rgba(125,211,252,0.45)" strokeWidth="2" strokeDasharray="6 6" />
      <circle cx="480" cy="160" r="142" fill="none" stroke="rgba(148,163,184,0.34)" strokeWidth="2" strokeDasharray="4 8" />
      <text x="640" y="110" className="fill-slate-300 text-[12px]">implizite Annahmen</text>
      <text x="286" y="236" className="fill-slate-300 text-[12px]">noch keine Relationen</text>
    </>
  );
}

function RetrievalVisual(): React.JSX.Element {
  const nodes = [
    { x: 220, y: 110, label: "Kontext A", weight: "hoch", r: 26, color: "#22d3ee" },
    { x: 330, y: 210, label: "Kontext B", weight: "mittel", r: 20, color: "#38bdf8" },
    { x: 490, y: 92, label: "Kontext C", weight: "hoch", r: 26, color: "#22d3ee" },
    { x: 610, y: 220, label: "Kontext D", weight: "niedrig", r: 16, color: "#94a3b8" },
    { x: 740, y: 128, label: "Kontext E", weight: "mittel", r: 20, color: "#38bdf8" },
  ];

  return (
    <>
      <rect x="60" y="40" width="840" height="240" rx="18" fill="rgba(15,23,42,0.45)" stroke="rgba(148,163,184,0.25)" />
      {nodes.map((node) => (
        <g key={node.label}>
          <circle cx={node.x} cy={node.y} r={node.r} fill={node.color} opacity="0.86" />
          <text x={node.x} y={node.y + 4} textAnchor="middle" className="fill-slate-950 text-[11px] font-semibold">
            {node.weight}
          </text>
          <text x={node.x} y={node.y + 38} textAnchor="middle" className="fill-slate-300 text-[11px]">
            {node.label}
          </text>
        </g>
      ))}
      <text x="74" y="30" className="fill-slate-300 text-[12px]">
        Priorisierung statt Vollständigkeit
      </text>
    </>
  );
}

function SynthesisVisual(): React.JSX.Element {
  const nodes = [
    { id: "q", x: 120, y: 165, label: "Frage" },
    { id: "c", x: 280, y: 100, label: "Konzept" },
    { id: "r", x: 440, y: 165, label: "Beziehung" },
    { id: "e", x: 620, y: 105, label: "Beleg" },
    { id: "s", x: 800, y: 165, label: "Schluss" },
  ];

  return (
    <>
      <path d="M120 165 L280 100 L440 165 L620 105 L800 165" stroke="#22d3ee" strokeWidth="4" fill="none" />
      <path d="M120 200 L280 225 L440 230" stroke="rgba(148,163,184,0.45)" strokeWidth="2" fill="none" strokeDasharray="5 6" />
      <path d="M440 95 L620 220 L800 210" stroke="rgba(148,163,184,0.45)" strokeWidth="2" fill="none" strokeDasharray="5 6" />
      {nodes.map((node) => (
        <g key={node.id}>
          <rect x={node.x - 56} y={node.y - 24} width="112" height="48" rx="12" fill="#f8fafc" stroke="#38bdf8" />
          <text x={node.x} y={node.y + 5} textAnchor="middle" className="fill-slate-900 text-[13px] font-semibold">
            {node.label}
          </text>
        </g>
      ))}
      <text x="90" y="52" className="fill-slate-300 text-[12px]">
        Markierter Ableitungspfad
      </text>
    </>
  );
}

function ActionVisual(): React.JSX.Element {
  return (
    <>
      <rect x="70" y="48" width="550" height="224" rx="16" fill="rgba(15,23,42,0.45)" stroke="rgba(148,163,184,0.34)" />
      <rect x="650" y="48" width="240" height="224" rx="16" fill="rgba(15,23,42,0.45)" stroke="rgba(148,163,184,0.34)" />

      <circle cx="200" cy="110" r="20" fill="#38bdf8" />
      <circle cx="320" cy="160" r="20" fill="#22d3ee" />
      <circle cx="450" cy="125" r="20" fill="#22c55e" />
      <circle cx="560" cy="180" r="22" fill="#f59e0b" />

      <line x1="200" y1="110" x2="320" y2="160" stroke="#7dd3fc" strokeWidth="3" />
      <line x1="320" y1="160" x2="450" y2="125" stroke="#7dd3fc" strokeWidth="3" />
      <line x1="450" y1="125" x2="560" y2="180" stroke="#86efac" strokeWidth="3" />
      <path d="M320 160 C360 230,500 230,560 180" stroke="rgba(148,163,184,0.56)" strokeWidth="2" fill="none" strokeDasharray="6 6" />

      <text x="690" y="90" className="fill-slate-300 text-[12px] font-semibold">Version-Layer</text>
      <rect x="680" y="110" width="180" height="34" rx="8" fill="#0f172a" stroke="#475569" />
      <text x="770" y="132" textAnchor="middle" className="fill-slate-200 text-[11px]">v1 stabiler Pfad</text>
      <rect x="680" y="152" width="180" height="34" rx="8" fill="#0f172a" stroke="#475569" />
      <text x="770" y="174" textAnchor="middle" className="fill-slate-200 text-[11px]">v2 Fragevariation</text>
      <rect x="680" y="194" width="180" height="34" rx="8" fill="#0f172a" stroke="#475569" />
      <text x="770" y="216" textAnchor="middle" className="fill-slate-200 text-[11px]">v3 Trade-off-Pfad</text>
    </>
  );
}
