import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  createCuratedSourceCatalog,
  createSeedDataset,
  validateSeedDataset,
} from "@/features/seed-data/seed-data";

describe("seed dataset generation", () => {
  it("creates a curated and schema-valid dataset from primary markdown sources", () => {
    const dataset = createSeedDataset();
    const validation = validateSeedDataset(dataset);

    expect(dataset.sources.length).toBeGreaterThanOrEqual(3);
    expect(dataset.nodes.length).toBeGreaterThan(0);
    expect(dataset.edges.length).toBeGreaterThan(0);
    expect(dataset.sources.some((source) => source.sourceType === "primary_md")).toBe(true);
    expect(dataset.sources.some((source) => source.sourceType === "optional_internet")).toBe(true);
    expect(dataset.nodes.every((node) => node.internalSource.sourceFile.length > 0)).toBe(true);
    expect(dataset.edges.every((edge) => edge.publicReference.citation.length > 0)).toBe(true);
    expect(validation.valid).toBe(true);
    expect(validation.errors).toEqual([]);
  });

  it("generates deterministic sources, nodes and edges", () => {
    const first = createSeedDataset();
    const second = createSeedDataset();

    expect(second).toEqual(first);
  });

  it("exposes a curated source catalog with sourceType and sourceFile", () => {
    const sources = createCuratedSourceCatalog();

    expect(sources.length).toBeGreaterThanOrEqual(3);
    expect(sources.some((source) => source.sourceType === "primary_md")).toBe(true);
    expect(sources.some((source) => source.sourceType === "optional_internet")).toBe(true);
    expect(sources.every((source) => source.sourceFile.length > 0)).toBe(true);
    expect(sources.every((source) => source.publicReference.citation.length > 0)).toBe(true);
  });
});

describe("seed dataset validation", () => {
  it("rejects schema violations for missing required fields and disallowed relation direction", () => {
    const invalidDataset = {
      sources: [
        {
          sourceId: "src-a",
          sourceType: "primary_md" as const,
          sourceFile: "a.md",
          title: "A",
          scopeNote: "scope",
          internalSource: { sourceType: "primary_md" as const, sourceFile: "a.md" },
          publicReference: { kind: "book" as const, citation: "A" },
        },
      ],
      nodes: [
        {
          id: "author:broken",
          nodeType: "Author" as const,
          summary: "",
          name: "",
          sourceType: "primary_md" as const,
          sourceFile: "a.md",
          internalSource: { sourceType: "primary_md" as const, sourceFile: "a.md" },
          publicReference: { kind: "book" as const, citation: "A" },
        },
        {
          id: "book:1",
          nodeType: "Book" as const,
          title: "Book 1",
          summary: "Summary",
          sourceType: "primary_md" as const,
          sourceFile: "a.md",
          internalSource: { sourceType: "primary_md" as const, sourceFile: "a.md" },
          publicReference: { kind: "book" as const, citation: "A" },
        },
      ],
      edges: [
        {
          type: "WROTE" as const,
          fromNodeId: "book:1",
          toNodeId: "author:broken",
          sourceType: "primary_md" as const,
          sourceFile: "a.md",
          internalSource: { sourceType: "primary_md" as const, sourceFile: "a.md" },
          publicReference: { kind: "book" as const, citation: "A" },
        },
      ],
    };

    const validation = validateSeedDataset(invalidDataset);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toContain("Node author:broken hat leeres Pflichtfeld summary.");
    expect(validation.errors).toContain("Author author:broken hat kein Pflichtfeld name.");
    expect(validation.errors).toContain(
      "Edge WROTE:book:1:author:broken verletzt Ontologie-Regel fuer Book -> Author.",
    );
  });

  it("rejects duplicate node IDs and duplicate edges", () => {
    const invalidDataset = {
      sources: [
        {
          sourceId: "src-a",
          sourceType: "primary_md" as const,
          sourceFile: "a.md",
          title: "A",
          scopeNote: "scope",
          internalSource: { sourceType: "primary_md" as const, sourceFile: "a.md" },
          publicReference: { kind: "book" as const, citation: "A" },
        },
      ],
      nodes: [
        {
          id: "concept:1",
          nodeType: "Concept" as const,
          title: "Concept 1",
          summary: "Summary",
          embedding: [0.1, 0.2, 0.3, 0.4],
          sourceType: "primary_md" as const,
          sourceFile: "a.md",
          internalSource: { sourceType: "primary_md" as const, sourceFile: "a.md" },
          publicReference: { kind: "book" as const, citation: "A" },
        },
        {
          id: "concept:1",
          nodeType: "Concept" as const,
          title: "Concept duplicate",
          summary: "Summary duplicate",
          embedding: [0.1, 0.2, 0.3, 0.4],
          sourceType: "primary_md" as const,
          sourceFile: "a.md",
          internalSource: { sourceType: "primary_md" as const, sourceFile: "a.md" },
          publicReference: { kind: "book" as const, citation: "A" },
        },
      ],
      edges: [
        {
          type: "INFLUENCES" as const,
          fromNodeId: "concept:1",
          toNodeId: "concept:1",
          sourceType: "primary_md" as const,
          sourceFile: "a.md",
          internalSource: { sourceType: "primary_md" as const, sourceFile: "a.md" },
          publicReference: { kind: "book" as const, citation: "A" },
        },
        {
          type: "INFLUENCES" as const,
          fromNodeId: "concept:1",
          toNodeId: "concept:1",
          sourceType: "primary_md" as const,
          sourceFile: "a.md",
          internalSource: { sourceType: "primary_md" as const, sourceFile: "a.md" },
          publicReference: { kind: "book" as const, citation: "A" },
        },
      ],
    };

    const validation = validateSeedDataset(invalidDataset);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toContain("Node-ID concept:1 ist nicht eindeutig.");
    expect(validation.errors).toContain("Edge INFLUENCES:concept:1:concept:1 ist nicht eindeutig.");
  });

  it("rejects nodes and edges that reference unknown curated sources", () => {
    const invalidDataset = {
      sources: [
        {
          sourceId: "src-a",
          sourceType: "primary_md" as const,
          sourceFile: "a.md",
          title: "A",
          scopeNote: "scope",
          internalSource: { sourceType: "primary_md" as const, sourceFile: "a.md" },
          publicReference: { kind: "book" as const, citation: "A" },
        },
      ],
      nodes: [
        {
          id: "concept:1",
          nodeType: "Concept" as const,
          title: "Concept 1",
          summary: "Summary",
          embedding: [0.1, 0.2, 0.3, 0.4],
          sourceType: "primary_md" as const,
          sourceFile: "missing.md",
          internalSource: { sourceType: "primary_md" as const, sourceFile: "missing.md" },
          publicReference: { kind: "book" as const, citation: "A" },
        },
      ],
      edges: [
        {
          type: "INFLUENCES" as const,
          fromNodeId: "concept:1",
          toNodeId: "concept:1",
          sourceType: "primary_md" as const,
          sourceFile: "missing.md",
          internalSource: { sourceType: "primary_md" as const, sourceFile: "missing.md" },
          publicReference: { kind: "book" as const, citation: "A" },
        },
      ],
    };

    const validation = validateSeedDataset(invalidDataset);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toContain(
      "Node concept:1 referenziert unbekannte Quelle primary_md:missing.md.",
    );
    expect(validation.errors).toContain(
      "Edge INFLUENCES:concept:1:concept:1 referenziert unbekannte Quelle primary_md:missing.md.",
    );
  });
});

describe("seed data function documentation", () => {
  it("requires JSDoc blocks for all functions in seed-data.ts", () => {
    const source = readFileSync(new URL("./seed-data.ts", import.meta.url), "utf8");
    const functionNames = [
      "createPublicReference",
      "isValidSourceType",
      "createCuratedSourceCatalog",
      "createSeedDataset",
      "validateSeedDataset",
    ];

    for (const functionName of functionNames) {
      const jsdocRegex = new RegExp(
        String.raw`/\*\*[\s\S]*?\*/\s*(?:export\s+)?function\s+${functionName}\s*\(`,
        "m",
      );
      expect(source).toMatch(jsdocRegex);
    }
  });
});
