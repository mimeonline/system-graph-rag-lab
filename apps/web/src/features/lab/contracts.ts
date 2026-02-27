export type CaseStudyEntry = {
  context: string;
  decision: string;
  why: string;
  result: string;
  tradeoffs: string;
  date: string;
  commitRefs?: string[];
  phase?: "process" | "retrieval" | "ux" | "showcase" | "stability";
  impactScore?: number;
};

export type GitTimelineEvent = {
  id: string;
  date: string;
  theme: "process-governance" | "query-retrieval-core" | "graph-ux-iteration" | "public-showcase" | "stability-hardening";
  phase: "process" | "retrieval" | "ux" | "showcase" | "stability";
  context: string;
  decision: string;
  why: string;
  result: string;
  tradeoffs: string;
  commitRefs: string[];
  impactScore: number;
  commitCount: number;
};
