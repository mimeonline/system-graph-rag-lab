import neo4j from "neo4j-driver";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { readSeedDatasetForRuntime } from "@/features/seed-data/runtime-read";

describe("runtime seed data read access", () => {
  it("throws when required neo4j runtime variables are missing", async () => {
    const originalEnv = {
      NEO4J_URI: process.env.NEO4J_URI,
      NEO4J_DATABASE: process.env.NEO4J_DATABASE,
      NEO4J_USERNAME: process.env.NEO4J_USERNAME,
      NEO4J_PASSWORD: process.env.NEO4J_PASSWORD,
    };

    delete process.env.NEO4J_URI;
    delete process.env.NEO4J_DATABASE;
    delete process.env.NEO4J_USERNAME;
    delete process.env.NEO4J_PASSWORD;

    await expect(() => readSeedDatasetForRuntime()).rejects.toThrow(
      "Neo4j Runtime-Read hat ungueltiges Feld NEO4J_URI.",
    );

    if (originalEnv.NEO4J_URI === undefined) {
      delete process.env.NEO4J_URI;
    } else {
      process.env.NEO4J_URI = originalEnv.NEO4J_URI;
    }

    if (originalEnv.NEO4J_DATABASE === undefined) {
      delete process.env.NEO4J_DATABASE;
    } else {
      process.env.NEO4J_DATABASE = originalEnv.NEO4J_DATABASE;
    }

    if (originalEnv.NEO4J_USERNAME === undefined) {
      delete process.env.NEO4J_USERNAME;
    } else {
      process.env.NEO4J_USERNAME = originalEnv.NEO4J_USERNAME;
    }

    if (originalEnv.NEO4J_PASSWORD === undefined) {
      delete process.env.NEO4J_PASSWORD;
    } else {
      process.env.NEO4J_PASSWORD = originalEnv.NEO4J_PASSWORD;
    }
  });
});

const hasNeo4jEnv = [
  process.env.NEO4J_URI,
  process.env.NEO4J_DATABASE,
  process.env.NEO4J_USERNAME,
  process.env.NEO4J_PASSWORD,
].every((value) => typeof value === "string" && value.trim().length > 0);

describe.skipIf(!hasNeo4jEnv)("runtime seed data read integration with neo4j", () => {
  const marker = `it-runtime-read-${Date.now()}`;
  let driver: ReturnType<typeof neo4j.driver> | null = null;
  let database = "neo4j";

  beforeAll(async () => {
    database = process.env.NEO4J_DATABASE ?? "neo4j";
    driver = neo4j.driver(
      process.env.NEO4J_URI ?? "",
      neo4j.auth.basic(process.env.NEO4J_USERNAME ?? "", process.env.NEO4J_PASSWORD ?? ""),
    );
    await driver.verifyConnectivity();
    const session = driver.session({ database });
    try {
      await session.run(
        `
          CREATE (c1:Concept {
            id: $conceptId,
            title: "Integration Concept",
            summary: "Integration summary concept",
            sourceType: "primary_md",
            sourceFile: $marker
          })
          CREATE (t1:Tool {
            id: $toolId,
            title: "Integration Tool",
            summary: "Integration summary tool",
            sourceType: "optional_internet",
            sourceFile: $marker
          })
          CREATE (p1:Problem {
            id: $problemId,
            title: "Integration Problem",
            summary: "Integration summary problem",
            sourceType: "primary_md",
            sourceFile: $marker
          })
          CREATE (c1)-[:INFLUENCES {sourceType: "primary_md", sourceFile: $marker}]->(t1)
          CREATE (t1)-[:ADDRESSES {sourceType: "optional_internet", sourceFile: $marker}]->(p1)
        `,
        {
          conceptId: `${marker}-concept`,
          toolId: `${marker}-tool`,
          problemId: `${marker}-problem`,
          marker,
        },
      );
    } finally {
      await session.close();
    }
  });

  afterAll(async () => {
    if (!driver) {
      return;
    }

    const session = driver.session({ database });
    try {
      await session.run(
        `
          MATCH (n)
          WHERE n.sourceFile = $marker
          DETACH DELETE n
        `,
        { marker },
      );
    } finally {
      await session.close();
      await driver.close();
    }
  });

  it("reads real nodes and relations from neo4j with source markers", async () => {
    const result = await readSeedDatasetForRuntime();
    const nodesFromMarker = result.nodes.filter((node) => node.sourceFile === marker);
    const edgesFromMarker = result.edges.filter((edge) => edge.sourceFile === marker);

    expect(nodesFromMarker.length).toBeGreaterThanOrEqual(2);
    expect(edgesFromMarker.length).toBeGreaterThanOrEqual(2);

    for (const node of nodesFromMarker) {
      expect(node.id.length).toBeGreaterThan(0);
      expect(["primary_md", "optional_internet"]).toContain(node.sourceType);
      expect(node.sourceFile).toBe(marker);
    }

    for (const edge of edgesFromMarker) {
      expect(edge.fromNodeId.length).toBeGreaterThan(0);
      expect(edge.toNodeId.length).toBeGreaterThan(0);
      expect(["primary_md", "optional_internet"]).toContain(edge.sourceType);
      expect(edge.sourceFile).toBe(marker);
    }
  });
});
