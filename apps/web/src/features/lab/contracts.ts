export type CaseStudyEntry = {
  context: string;
  decision: string;
  why: string;
  result: string;
  tradeoffs: string;
  date: string;
  commitRefs?: string[];
  phase?: "retrieval" | "ux" | "stability" | "storytelling";
  impactScore?: number;
};

export type GitTimelineEvent = {
  id: string;
  date: string;
  theme: "graph-ux" | "retrieval-prompting" | "stability-ops" | "storytelling-showcase";
  phase: "retrieval" | "ux" | "stability" | "storytelling";
  context: string;
  decision: string;
  why: string;
  result: string;
  tradeoffs: string;
  commitRefs: string[];
  impactScore: number;
  commitCount: number;
};
