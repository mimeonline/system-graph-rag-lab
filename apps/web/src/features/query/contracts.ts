import type {
  PublicReference,
  SeedSourceType,
} from "@/features/seed-data/seed-data";

export const TOP_K = 6;
export const HOP_DEPTH = 1;
export const CONTEXT_BUDGET_TOKENS = 1400;

export type QueryRequest = {
  query: string;
  clientRequestId?: string;
};

export type QueryReferenceLink = {
  label: string;
  url: string;
};

export type QueryReference = {
  nodeId: string;
  nodeType: "Concept" | "Tool" | "Author" | "Book" | "Problem";
  title: string;
  score: number;
  hop: number;
  citation: string;
  explanationUrl?: string;
  toolLinks: QueryReferenceLink[];
};

type ContextElementSourceKind = "candidate" | "extension";

export type QueryContextElementSource = {
  kind: ContextElementSourceKind;
  candidateId: string;
  sourceId?: string;
  sourceFile: string;
  sourceType: SeedSourceType;
  publicReference: PublicReference;
};

export type QueryContextElement = {
  nodeId: string;
  nodeType: QueryReference["nodeType"];
  title: string;
  summary: string;
  source: QueryContextElementSource;
};

export type QueryResponseContext = {
  elements: QueryContextElement[];
};

export type QuerySuccessResponse = {
  status: "ok";
  state: "answer" | "empty";
  requestId: string;
  answer: {
    main: string;
    coreRationale: string;
    nextSteps: string[];
  };
  references: QueryReference[];
  context: QueryResponseContext;
  meta: {
    topK: number;
    hopDepth: number;
    retrievedNodeCount: number;
    contextTokens: number;
    latencyMs: number;
    rateLimit: {
      limit: number;
      windowSeconds: number;
      remaining: number;
    };
  };
};

export type QueryErrorResponse = {
  status: "error";
  requestId: string;
  error: {
    code:
      | "INVALID_REQUEST"
      | "RATE_LIMIT"
      | "LLM_UPSTREAM_ERROR"
      | "GRAPH_BACKEND_UNAVAILABLE"
      | "UPSTREAM_TIMEOUT"
      | "INTERNAL_ERROR";
    message: string;
    retryable: boolean;
    retryAfterSeconds?: number;
  };
  meta: {
    latencyMs: number;
  };
};
