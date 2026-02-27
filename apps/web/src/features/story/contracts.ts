export type StoryStep = {
  id: string;
  title: string;
  stepHeadline: string;
  stepSubline: string;
  goal: string;
  visualState: "problem" | "retrieval" | "graph" | "synthesis" | "decision";
  scenePreset: "isolated-problem" | "scored-retrieval" | "relational-graph" | "context-synthesis" | "decision-subgraph";
  camera: {
    x: number;
    y: number;
    z: number;
  };
  motionClip?: string;
  tokenState: "raw" | "filtered" | "linked" | "synthesized" | "actionable";
  highlightNodes: string[];
  animationMode: "pulse" | "flow" | "orbit" | "focus";
  overlayNotes: string[];
  narration: string;
  problemStatement: string;
  modelChange: string;
  valueStatement: string;
  edgeLegend: Array<{ type: string; color: string; label: string }>;
  llmInputPreview: {
    nodes: string[];
    edges: string[];
    budget: string;
  };
  beforeAfter: {
    llmOnly: string;
    graphRag: string;
  };
  references: Array<{ label: string; href: string }>;
  cta?: { label: string; href: string };
};
