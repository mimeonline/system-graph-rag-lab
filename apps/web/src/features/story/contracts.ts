export type StoryStep = {
  id: string;
  title: string;
  goal: string;
  visualState: "problem" | "retrieval" | "graph" | "synthesis" | "decision";
  scenePreset: "isolated-problem" | "scored-retrieval" | "relational-graph" | "context-synthesis" | "decision-subgraph";
  camera: {
    x: number;
    y: number;
    z: number;
  };
  highlightNodes: string[];
  animationMode: "pulse" | "flow" | "orbit" | "focus";
  overlayNotes: string[];
  narration: string;
  references: Array<{ label: string; href: string }>;
  cta?: { label: string; href: string };
};
