import { describe, expect, it } from "vitest";

import type { QuerySuccessResponse } from "@/features/query/contracts";
import { buildHomeGraphModel } from "@/features/home/graph-view-model";
import { buildQueryViewModel } from "@/features/query/view-model";

function createResponse(): QuerySuccessResponse {
  return {
    status: "ok",
    state: "answer",
    requestId: "req-graph-test",
    answer: {
      main: "Antwort",
      coreRationale: "Rationale",
      nextSteps: [],
    },
    references: [
      {
        nodeId: "concept:feedback-loops",
        nodeType: "Concept",
        title: "Feedback Loops",
        score: 1,
        hop: 0,
        citation: "System Dynamics Basics",
        explanationUrl: "https://example.org/feedback-loops",
        toolLinks: [],
      },
      {
        nodeId: "concept:delays",
        nodeType: "Concept",
        title: "Delays",
        score: 0.95,
        hop: 0,
        citation: "System Dynamics Basics",
        explanationUrl: "https://example.org/delays",
        toolLinks: [],
      },
    ],
    context: {
      elements: [
        {
          nodeId: "concept:feedback-loops",
          nodeType: "Concept",
          title: "Feedback Loops",
          summary: "Verstärkende und ausgleichende Rückkopplungen.",
          source: {
            kind: "candidate",
            candidateId: "concept:feedback-loops",
            sourceFile: "feedback-loops.md",
            sourceType: "primary_md",
            publicReference: {
              kind: "book",
              citation: "System Dynamics Basics",
            },
          },
        },
      ],
    },
    meta: {
      topK: 6,
      hopDepth: 1,
      retrievedNodeCount: 2,
      contextTokens: 300,
      latencyMs: 40,
      rateLimit: {
        limit: 10,
        windowSeconds: 60,
        remaining: 8,
      },
    },
  };
}

describe("buildHomeGraphModel", () => {
  it("returns fallback graph when no query data is available", () => {
    const model = buildHomeGraphModel(null, "");
    const queryNode = model.nodes.find((node) => node.id === "query-fallback");
    const referenceNode = model.nodes.find((node) => node.id === "top-concept-fallback");

    expect(model.isFallback).toBe(true);
    expect(model.nodes.length).toBeGreaterThanOrEqual(4);
    expect(model.edges.length).toBeGreaterThanOrEqual(3);
    expect(queryNode?.y).toBe(20);
    expect(referenceNode?.y).toBe(56);
  });

  it("derives nodes and edges from query view model data", () => {
    const viewModel = buildQueryViewModel(createResponse(), "Wie wirken Feedback Loops?");

    const model = buildHomeGraphModel(viewModel, viewModel.query);
    const queryNode = model.nodes.find((node) => node.id === "query");
    const feedbackNode = model.nodes.find((node) => node.id === "concept:feedback-loops");

    expect(model.isFallback).toBe(false);
    expect(model.nodes.some((node) => node.id === "query")).toBe(true);
    expect(model.nodes.some((node) => node.id === "concept:feedback-loops")).toBe(true);
    expect(model.edges.some((edge) => edge.source === "query")).toBe(true);
    expect(model.caption).toContain("relevante Konzepte");
    expect(queryNode?.y).toBe(20);
    expect(feedbackNode?.y).toBe(56);
  });
});
