import { describe, expect, it } from "vitest";
import { createSeedDataset, validateSeedDataset } from "@/features/seed-data/seed-data";

describe("seed dataset generation", () => {
  it("creates a schema-valid dataset with more than 100 nodes and more than 200 edges", () => {
    const dataset = createSeedDataset();
    const validation = validateSeedDataset(dataset);

    expect(dataset.nodes.length).toBeGreaterThan(100);
    expect(dataset.edges.length).toBeGreaterThan(200);
    expect(validation.valid).toBe(true);
    expect(validation.errors).toEqual([]);
  });

  it("generates deterministic node and edge totals", () => {
    const first = createSeedDataset();
    const second = createSeedDataset();

    expect(first.nodes.length).toBe(130);
    expect(first.edges.length).toBe(315);
    expect(second.nodes.length).toBe(130);
    expect(second.edges.length).toBe(315);
    expect(second).toEqual(first);
  });
});

describe("seed dataset validation", () => {
  it("rejects schema violations for missing required fields and disallowed relation direction", () => {
    const invalidDataset = {
      nodes: [
        {
          id: "author:broken",
          nodeType: "Author" as const,
          summary: "",
          name: "",
        },
        {
          id: "book:1",
          nodeType: "Book" as const,
          title: "Book 1",
          summary: "Summary",
        },
      ],
      edges: [
        {
          type: "WROTE" as const,
          fromNodeId: "book:1",
          toNodeId: "author:broken",
        },
      ],
    };

    const validation = validateSeedDataset(invalidDataset);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toContain(
      "Node author:broken hat leeres Pflichtfeld summary.",
    );
    expect(validation.errors).toContain(
      "Author author:broken hat kein Pflichtfeld name.",
    );
    expect(validation.errors).toContain(
      "Edge WROTE:book:1:author:broken verletzt Ontologie-Regel fuer Book -> Author.",
    );
  });

  it("rejects duplicate node IDs and duplicate edges", () => {
    const invalidDataset = {
      nodes: [
        {
          id: "concept:1",
          nodeType: "Concept" as const,
          title: "Concept 1",
          summary: "Summary",
          embedding: [0.1, 0.2, 0.3, 0.4],
        },
        {
          id: "concept:1",
          nodeType: "Concept" as const,
          title: "Concept duplicate",
          summary: "Summary duplicate",
          embedding: [0.1, 0.2, 0.3, 0.4],
        },
      ],
      edges: [
        {
          type: "INFLUENCES" as const,
          fromNodeId: "concept:1",
          toNodeId: "concept:1",
        },
        {
          type: "INFLUENCES" as const,
          fromNodeId: "concept:1",
          toNodeId: "concept:1",
        },
      ],
    };

    const validation = validateSeedDataset(invalidDataset);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toContain("Node-ID concept:1 ist nicht eindeutig.");
    expect(validation.errors).toContain(
      "Edge INFLUENCES:concept:1:concept:1 ist nicht eindeutig.",
    );
  });
});
