import neo4j from "neo4j-driver";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { runLocalSeedResetAndReseed } from "@/features/seed-data/local-seed-reset";
import type { SeedDataset } from "@/features/seed-data/seed-data";

type FakeTransaction = {
  run: ReturnType<typeof vi.fn>;
};

type FakeSession = {
  executeWrite: ReturnType<typeof vi.fn>;
  close: ReturnType<typeof vi.fn>;
};

type FakeDriver = {
  verifyConnectivity: ReturnType<typeof vi.fn>;
  session: ReturnType<typeof vi.fn>;
  close: ReturnType<typeof vi.fn>;
};

function createMinimalSeedDataset(): SeedDataset {
  return {
    sources: [
      {
        sourceId: "test-source",
        sourceType: "primary_md",
        sourceFile: "test.md",
        title: "Test Source",
        scopeNote: "test",
        internalSource: {
          sourceType: "primary_md",
          sourceFile: "test.md",
        },
        publicReference: {
          kind: "book",
          citation: "test",
        },
      },
    ],
    nodes: [
      {
        id: "concept:test",
        nodeType: "Concept",
        title: "Test Concept",
        summary: "summary",
        embedding: [0.1, 0.2, 0.3],
        sourceType: "primary_md",
        sourceFile: "test.md",
        internalSource: {
          sourceType: "primary_md",
          sourceFile: "test.md",
        },
        publicReference: {
          kind: "book",
          citation: "test",
        },
      },
      {
        id: "problem:test",
        nodeType: "Problem",
        title: "Test Problem",
        summary: "summary",
        embedding: [0.3, 0.2, 0.1],
        sourceType: "primary_md",
        sourceFile: "test.md",
        internalSource: {
          sourceType: "primary_md",
          sourceFile: "test.md",
        },
        publicReference: {
          kind: "book",
          citation: "test",
        },
      },
      {
        id: "tool:test",
        nodeType: "Tool",
        title: "Test Tool",
        summary: "summary",
        embedding: [0.4, 0.5, 0.6],
        sourceType: "primary_md",
        sourceFile: "test.md",
        internalSource: {
          sourceType: "primary_md",
          sourceFile: "test.md",
        },
        publicReference: {
          kind: "book",
          citation: "test",
        },
      },
    ],
    edges: [
      {
        type: "RELATES_TO",
        fromNodeId: "problem:test",
        toNodeId: "concept:test",
        sourceType: "primary_md",
        sourceFile: "test.md",
        internalSource: {
          sourceType: "primary_md",
          sourceFile: "test.md",
        },
        publicReference: {
          kind: "book",
          citation: "test",
        },
      },
      {
        type: "INFLUENCES",
        fromNodeId: "concept:test",
        toNodeId: "tool:test",
        sourceType: "primary_md",
        sourceFile: "test.md",
        internalSource: {
          sourceType: "primary_md",
          sourceFile: "test.md",
        },
        publicReference: {
          kind: "book",
          citation: "test",
        },
      },
    ],
  };
}

describe("local neo4j seed reset and reseed", () => {
  const originalEnv = {
    NEO4J_URI: process.env.NEO4J_URI,
    NEO4J_DATABASE: process.env.NEO4J_DATABASE,
    NEO4J_USERNAME: process.env.NEO4J_USERNAME,
    NEO4J_PASSWORD: process.env.NEO4J_PASSWORD,
  };

  beforeEach(() => {
    process.env.NEO4J_URI = originalEnv.NEO4J_URI;
    process.env.NEO4J_DATABASE = originalEnv.NEO4J_DATABASE;
    process.env.NEO4J_USERNAME = originalEnv.NEO4J_USERNAME;
    process.env.NEO4J_PASSWORD = originalEnv.NEO4J_PASSWORD;
  });

  afterEach(() => {
    process.env.NEO4J_URI = originalEnv.NEO4J_URI;
    process.env.NEO4J_DATABASE = originalEnv.NEO4J_DATABASE;
    process.env.NEO4J_USERNAME = originalEnv.NEO4J_USERNAME;
    process.env.NEO4J_PASSWORD = originalEnv.NEO4J_PASSWORD;
  });

  it("fails fast on missing credentials and does not start import", async () => {
    process.env.NEO4J_URI = "bolt://localhost:7687";
    process.env.NEO4J_DATABASE = "neo4j";
    delete process.env.NEO4J_USERNAME;
    delete process.env.NEO4J_PASSWORD;

    const driverFactory = vi.fn();
    await expect(() =>
      runLocalSeedResetAndReseed({
        driverFactory,
      }),
    ).rejects.toThrow("Neo4j Seed-Reset/Reseed hat ungueltiges Feld NEO4J_USERNAME.");

    expect(driverFactory).not.toHaveBeenCalled();
  });

  it("runs reset, reseed and read check with injected runtime adapter", async () => {
    process.env.NEO4J_URI = "bolt://localhost:7687";
    process.env.NEO4J_DATABASE = "neo4j";
    process.env.NEO4J_USERNAME = "neo4j";
    process.env.NEO4J_PASSWORD = "secret";

    const transaction: FakeTransaction = {
      run: vi.fn().mockResolvedValue(undefined),
    };
    const session: FakeSession = {
      executeWrite: vi.fn().mockImplementation(async (callback: (tx: FakeTransaction) => Promise<void>) => {
        await callback(transaction);
      }),
      close: vi.fn().mockResolvedValue(undefined),
    };
    const driver: FakeDriver = {
      verifyConnectivity: vi.fn().mockResolvedValue(undefined),
      session: vi.fn().mockReturnValue(session),
      close: vi.fn().mockResolvedValue(undefined),
    };

    const result = await runLocalSeedResetAndReseed({
      driverFactory: vi.fn().mockReturnValue(driver),
      seedDatasetFactory: createMinimalSeedDataset,
      runtimeRead: async () => ({
        nodes: [
          {
            id: "concept:test",
            nodeType: "Concept",
            title: "Test Concept",
            summary: "summary",
            sourceType: "primary_md",
            sourceFile: "test.md",
          },
          {
            id: "problem:test",
            nodeType: "Problem",
            title: "Test Problem",
            summary: "summary",
            sourceType: "primary_md",
            sourceFile: "test.md",
          },
        ],
        edges: [
          {
            type: "RELATES_TO",
            fromNodeId: "problem:test",
            toNodeId: "concept:test",
            sourceType: "primary_md",
            sourceFile: "test.md",
          },
          {
            type: "INFLUENCES",
            fromNodeId: "concept:test",
            toNodeId: "tool:test",
            sourceType: "primary_md",
            sourceFile: "test.md",
          },
        ],
      }),
    });

    expect(driver.verifyConnectivity).toHaveBeenCalledTimes(1);
    expect(session.executeWrite).toHaveBeenCalledTimes(1);
    expect(transaction.run).toHaveBeenCalled();
    expect(session.close).toHaveBeenCalledTimes(1);
    expect(driver.close).toHaveBeenCalledTimes(1);

    expect(result.insertedNodeCount).toBe(3);
    expect(result.insertedEdgeCount).toBe(2);
    expect(result.readCheckNodeCount).toBe(2);
    expect(result.readCheckEdgeCount).toBe(2);
  });
});

const hasNeo4jEnv = [
  process.env.NEO4J_URI,
  process.env.NEO4J_DATABASE,
  process.env.NEO4J_USERNAME,
  process.env.NEO4J_PASSWORD,
].every((value) => typeof value === "string" && value.trim().length > 0);

describe.skipIf(!hasNeo4jEnv)("local neo4j seed reset and reseed integration", () => {
  let driver: ReturnType<typeof neo4j.driver> | null = null;
  let database = "neo4j";

  beforeAll(async () => {
    database = process.env.NEO4J_DATABASE ?? "neo4j";
    driver = neo4j.driver(
      process.env.NEO4J_URI ?? "",
      neo4j.auth.basic(process.env.NEO4J_USERNAME ?? "", process.env.NEO4J_PASSWORD ?? ""),
    );
    await driver.verifyConnectivity();
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
          WHERE n.id STARTS WITH 'it-local-seed-reset:'
          DETACH DELETE n
        `,
      );
    } finally {
      await session.close();
      await driver.close();
    }
  });

  it("resets, reseeds and verifies runtime reads", async () => {
    const result = await runLocalSeedResetAndReseed();

    expect(result.insertedNodeCount).toBeGreaterThanOrEqual(100);
    expect(result.insertedEdgeCount).toBeGreaterThanOrEqual(200);
    expect(result.readCheckNodeCount).toBeGreaterThanOrEqual(2);
    expect(result.readCheckEdgeCount).toBeGreaterThanOrEqual(2);
  });
});
