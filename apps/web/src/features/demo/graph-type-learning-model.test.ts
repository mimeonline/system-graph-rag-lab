import { describe, expect, it } from "vitest";

import { DEMO_GRAPH_TYPES } from "@/features/demo/graph-type-learning-model";

describe("DEMO_GRAPH_TYPES", () => {
  it("contains the five planned GraphRAG learning modes", () => {
    expect(DEMO_GRAPH_TYPES.map((type) => type.id)).toEqual([
      "knowledge",
      "domain",
      "document",
      "conversation",
      "dynamic",
    ]);
  });

  it("exposes stable unique URL slugs", () => {
    expect(DEMO_GRAPH_TYPES.map((type) => type.slug)).toEqual([
      "wissensgraph",
      "domaenen-graph",
      "dokument-graph",
      "conversational-graph",
      "dynamischer-graph",
    ]);
    expect(new Set(DEMO_GRAPH_TYPES.map((type) => type.slug))).toHaveProperty("size", 5);
  });

  it("keeps every simulated graph internally connected", () => {
    for (const graphType of DEMO_GRAPH_TYPES) {
      const nodeIds = new Set(graphType.nodes.map((node) => node.id));

      expect(graphType.steps).toHaveLength(3);
      expect(graphType.edges.length).toBeGreaterThanOrEqual(5);

      for (const edge of graphType.edges) {
        expect(nodeIds.has(edge.source)).toBe(true);
        expect(nodeIds.has(edge.target)).toBe(true);
      }
    }
  });
});
