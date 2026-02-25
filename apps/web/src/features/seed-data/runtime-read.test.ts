import { describe, expect, it } from "vitest";
import { readSeedDatasetForRuntime } from "@/features/seed-data/runtime-read";

describe("runtime seed data read access", () => {
  it("reads nodes and relations with source markers for runtime usage", () => {
    const result = readSeedDatasetForRuntime();

    expect(result.nodes.length).toBeGreaterThanOrEqual(2);
    expect(result.edges.length).toBeGreaterThanOrEqual(2);

    const sampledNodes = result.nodes.slice(0, 2);
    const sampledEdges = result.edges.slice(0, 2);

    for (const node of sampledNodes) {
      expect(node.id.length).toBeGreaterThan(0);
      expect(["primary_md", "optional_internet"]).toContain(node.sourceType);
      expect(node.sourceFile.length).toBeGreaterThan(0);
    }

    for (const edge of sampledEdges) {
      expect(edge.fromNodeId.length).toBeGreaterThan(0);
      expect(edge.toNodeId.length).toBeGreaterThan(0);
      expect(["primary_md", "optional_internet"]).toContain(edge.sourceType);
      expect(edge.sourceFile.length).toBeGreaterThan(0);
    }
  });

  it("throws when the normalized data basis is invalid", () => {
    expect(() =>
      readSeedDatasetForRuntime({
        datasetFactory: () => ({
          sources: [],
          nodes: [],
          edges: [],
        }),
      }),
    ).toThrow("Seed-Datenbasis ist ungueltig");
  });
});
