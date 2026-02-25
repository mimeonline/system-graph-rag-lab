import { describe, expect, it } from "vitest";
import { createSeedDataset } from "@/features/seed-data/seed-data";
import { runSeedDatasetQualityCheck } from "@/features/seed-data/quality-check";

describe("seed data quality check", () => {
  it("creates a clean report for the curated dataset", () => {
    const dataset = createSeedDataset();

    const result = runSeedDatasetQualityCheck(dataset);

    expect(result.valid).toBe(true);
    expect(result.report.issues).toEqual([]);

    expect(result.report.sources.checked).toBe(dataset.sources.length);
    expect(result.report.nodes.checked).toBe(dataset.nodes.length);
    expect(result.report.edges.checked).toBe(dataset.edges.length);

    expect(result.report.sources.ausgeschlossen).toBe(0);
    expect(result.report.nodes.ausgeschlossen).toBe(0);
    expect(result.report.edges.ausgeschlossen).toBe(0);

    expect(result.report.bySourceType.primary_md.checked).toBeGreaterThan(0);
    expect(result.report.bySourceType.optional_internet.checked).toBeGreaterThan(0);

    expect(result.dataset).toEqual(dataset);
  });

  it("flags and excludes duplicate ids and duplicate relations", () => {
    const dataset = createSeedDataset();
    const duplicateNode = {
      ...dataset.nodes[0],
      title: "Duplicate node",
      summary: "Duplicate summary",
    };
    const duplicateEdge = {
      ...dataset.edges[0],
    };

    const result = runSeedDatasetQualityCheck({
      sources: dataset.sources,
      nodes: [...dataset.nodes, duplicateNode],
      edges: [...dataset.edges, duplicateEdge],
    });

    expect(result.valid).toBe(false);
    expect(result.report.nodes.beanstandet).toBe(1);
    expect(result.report.nodes.ausgeschlossen).toBe(1);
    expect(result.report.edges.beanstandet).toBe(1);
    expect(result.report.edges.ausgeschlossen).toBe(1);
    expect(result.report.issues.some((issue) => issue.reason === "duplizierte node id")).toBe(true);
    expect(result.report.issues.some((issue) => issue.reason === "duplizierte relation")).toBe(true);

    expect(result.dataset.nodes.length).toBe(dataset.nodes.length);
    expect(result.dataset.edges.length).toBe(dataset.edges.length);
  });

  it("reports source type split for primary_md and optional_internet", () => {
    const dataset = createSeedDataset();
    const optionalNode = dataset.nodes.find((node) => node.sourceType === "optional_internet");

    expect(optionalNode).toBeDefined();

    const invalidOptionalNode = {
      ...optionalNode!,
      sourceFile: "unknown-source.md",
      internalSource: {
        sourceType: optionalNode!.sourceType,
        sourceFile: "unknown-source.md",
      },
    };

    const result = runSeedDatasetQualityCheck({
      sources: dataset.sources,
      nodes: [...dataset.nodes, invalidOptionalNode],
      edges: dataset.edges,
    });

    expect(result.valid).toBe(false);
    expect(result.report.bySourceType.optional_internet.beanstandet).toBe(1);
    expect(result.report.bySourceType.optional_internet.ausgeschlossen).toBe(1);
    expect(result.report.bySourceType.primary_md.beanstandet).toBe(0);
    expect(result.report.issues.some((issue) => issue.sourceType === "optional_internet")).toBe(true);
  });
});
