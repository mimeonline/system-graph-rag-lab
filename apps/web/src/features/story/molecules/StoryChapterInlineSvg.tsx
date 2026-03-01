import type { StoryChapterId } from "@/features/story/story-flow-model";

type StoryChapterInlineSvgProps = {
  chapterId: StoryChapterId;
};

export function StoryChapterInlineSvg({ chapterId }: StoryChapterInlineSvgProps): React.JSX.Element {
  return (
    <figure className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <svg viewBox="0 0 520 170" className="h-auto w-full" role="img" aria-label={`Diagramm ${chapterId}`}>
        {chapterId === "question" ? <QuestionMini /> : null}
        {chapterId === "retrieval" ? <RetrievalMini /> : null}
        {chapterId === "graph" ? <GraphMini /> : null}
        {chapterId === "synthesis" ? <SynthesisMini /> : null}
        {chapterId === "action" ? <ActionMini /> : null}
      </svg>
    </figure>
  );
}

function QuestionMini(): React.JSX.Element {
  return (
    <>
      <circle cx="260" cy="86" r="24" fill="#dbeafe" stroke="#0284c7" strokeWidth="2" />
      <circle cx="260" cy="86" r="44" fill="none" stroke="#7dd3fc" strokeDasharray="4 4" />
      <text x="260" y="90" textAnchor="middle" className="fill-slate-900 text-[11px] font-semibold">Kernfrage</text>
      <text x="320" y="58" className="fill-slate-600 text-[10px]">Annahmen</text>
      <text x="182" y="124" className="fill-slate-600 text-[10px]">Ziel und Grenze</text>
    </>
  );
}

function RetrievalMini(): React.JSX.Element {
  const nodes = [
    { x: 130, y: 84, r: 16, label: "hoch", fill: "#22d3ee" },
    { x: 220, y: 102, r: 13, label: "mittel", fill: "#38bdf8" },
    { x: 305, y: 72, r: 16, label: "hoch", fill: "#22d3ee" },
    { x: 385, y: 98, r: 11, label: "niedrig", fill: "#94a3b8" },
  ];
  return (
    <>
      {nodes.map((node) => (
        <g key={`${node.x}-${node.y}`}>
          <circle cx={node.x} cy={node.y} r={node.r} fill={node.fill} />
          <text x={node.x} y={node.y + 3} textAnchor="middle" className="fill-slate-900 text-[9px] font-semibold">{node.label}</text>
        </g>
      ))}
      <text x="108" y="46" className="fill-slate-600 text-[10px]">Kontext mit Gewichtung</text>
    </>
  );
}

function GraphMini(): React.JSX.Element {
  return (
    <>
      <circle cx="120" cy="86" r="16" fill="#bae6fd" />
      <circle cx="220" cy="56" r="16" fill="#a7f3d0" />
      <circle cx="220" cy="116" r="16" fill="#c4b5fd" />
      <circle cx="330" cy="86" r="16" fill="#fde68a" />
      <line x1="136" y1="84" x2="204" y2="58" stroke="#0ea5e9" strokeWidth="2.5" />
      <line x1="136" y1="88" x2="204" y2="114" stroke="#22c55e" strokeWidth="2.5" />
      <line x1="236" y1="56" x2="314" y2="84" stroke="#a78bfa" strokeWidth="2.5" />
      <line x1="236" y1="116" x2="314" y2="88" stroke="#f59e0b" strokeWidth="2.5" />
      <text x="88" y="130" className="fill-slate-600 text-[10px]">Ursache</text>
      <text x="170" y="130" className="fill-slate-600 text-[10px]">Trade-off</text>
      <text x="260" y="130" className="fill-slate-600 text-[10px]">Beleg</text>
    </>
  );
}

function SynthesisMini(): React.JSX.Element {
  return (
    <>
      <rect x="72" y="70" width="72" height="28" rx="7" fill="#f8fafc" stroke="#38bdf8" />
      <rect x="182" y="50" width="72" height="28" rx="7" fill="#f8fafc" stroke="#38bdf8" />
      <rect x="292" y="70" width="72" height="28" rx="7" fill="#f8fafc" stroke="#38bdf8" />
      <rect x="402" y="50" width="72" height="28" rx="7" fill="#f8fafc" stroke="#38bdf8" />
      <path d="M144 84 L182 64 L254 64 L292 84 L364 84 L402 64" stroke="#06b6d4" strokeWidth="2.5" fill="none" />
      <text x="78" y="42" className="fill-slate-600 text-[10px]">Markierter Herleitungspfad</text>
    </>
  );
}

function ActionMini(): React.JSX.Element {
  return (
    <>
      <circle cx="120" cy="86" r="14" fill="#38bdf8" />
      <circle cx="200" cy="66" r="14" fill="#22d3ee" />
      <circle cx="280" cy="94" r="14" fill="#22c55e" />
      <circle cx="360" cy="76" r="14" fill="#f59e0b" />
      <line x1="134" y1="84" x2="186" y2="68" stroke="#0ea5e9" strokeWidth="2.5" />
      <line x1="214" y1="68" x2="266" y2="92" stroke="#22c55e" strokeWidth="2.5" />
      <line x1="294" y1="92" x2="346" y2="78" stroke="#f59e0b" strokeWidth="2.5" />
      <rect x="404" y="52" width="90" height="18" rx="4" fill="#0f172a" stroke="#475569" />
      <rect x="404" y="76" width="90" height="18" rx="4" fill="#0f172a" stroke="#475569" />
      <rect x="404" y="100" width="90" height="18" rx="4" fill="#0f172a" stroke="#475569" />
      <text x="449" y="65" textAnchor="middle" className="fill-slate-200 text-[9px]">v1 aktiv</text>
      <text x="449" y="89" textAnchor="middle" className="fill-slate-200 text-[9px]">v2 geprüft</text>
      <text x="449" y="113" textAnchor="middle" className="fill-slate-200 text-[9px]">v3 Alternative</text>
    </>
  );
}
