import { GraphRagJourney3D } from "@/features/story/organisms/GraphRagJourney3D";
import type { StoryStep } from "@/features/story/contracts";

const GRAPH_CHAPTER_STEP: StoryStep = {
  id: "graph-chapter",
  title: "Graph",
  stepHeadline: "Begriffe zu Knoten, Relationen zu Typen",
  stepSubline: "Explizite Struktur statt impliziter Annahmen",
  goal: "Knoten verknüpfen",
  visualState: "graph",
  scenePreset: "relational-graph",
  camera: { x: 0.25, y: 0.2, z: 5.2 },
  tokenState: "linked",
  highlightNodes: ["q", "r1", "r2", "e1", "e2"],
  animationMode: "focus",
  overlayNotes: ["Ursache", "Trade-off", "Evidenz"],
  narration: "Der Graph macht Relationen sichtbar und typisiert sie explizit.",
  problemStatement: "Isolierte Knoten tragen keine belastbare Entscheidung.",
  modelChange: "Aus Kontext wird ein typisiertes Beziehungsmodell.",
  valueStatement: "Abhängigkeiten und Nebenwirkungen werden prüfbar.",
  edgeLegend: [
    { type: "cause", color: "#60a5fa", label: "Ursache-Wirkung" },
    { type: "evidence", color: "#22c55e", label: "Evidenzbezug" },
    { type: "tradeoff", color: "#a78bfa", label: "Trade-off" },
  ],
  llmInputPreview: {
    nodes: ["Frage", "Begriff A", "Begriff B", "Beleg 1", "Beleg 2"],
    edges: ["verursacht", "belegt", "konfligiert_mit"],
    budget: "TopK: 5 | Hops: 2 | Token: 2.4k",
  },
  beforeAfter: {
    llmOnly: "Relevante Begriffe ohne explizite Relationen.",
    graphRag: "Typisierte Relationen mit prüfbarer Herleitung.",
  },
  references: [
    { label: "Graph-Modell", href: "/story/graphrag" },
    { label: "Live Demo", href: "/demo" },
  ],
};

export function StoryChapter3DVisual(): React.JSX.Element {
  return (
    <div className="space-y-3">
      <GraphRagJourney3D step={GRAPH_CHAPTER_STEP} />
      <div className="rounded-xl border border-slate-300/80 bg-slate-50 p-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Statische Lesart</p>
        <p className="mt-1 text-sm text-slate-700">
          Knoten repraesentieren Begriffe. Kanten sind typisiert als Ursache-Wirkung, Trade-off oder Evidenzbezug.
          Die Markierung zeigt, welche Relationen in die Ableitung eingehen.
        </p>
      </div>
    </div>
  );
}
