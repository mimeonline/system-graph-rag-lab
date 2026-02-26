import neo4j, { type Driver } from "neo4j-driver";
import { getQueryRuntimeEnv } from "@/lib/env";
import { runSeedDatasetQualityCheck } from "@/features/seed-data/quality-check";
import { readSeedDatasetForRuntime, type RuntimeSeedReadResult } from "@/features/seed-data/runtime-read";
import {
  createSeedDataset,
  type SeedDataset,
  type SeedEdge,
  type SeedNode,
} from "@/features/seed-data/seed-data";

export type LocalSeedResetReseedResult = {
  deletedAllowedNodeTypes: SeedNode["nodeType"][];
  insertedNodeCount: number;
  insertedEdgeCount: number;
  readCheckNodeCount: number;
  readCheckEdgeCount: number;
};

type LocalSeedResetReseedOptions = {
  driverFactory?: (uri: string, username: string, password: string) => Driver;
  runtimeRead?: () => Promise<RuntimeSeedReadResult>;
  seedDatasetFactory?: () => SeedDataset;
};

const ALLOWED_NODE_TYPES: readonly SeedNode["nodeType"][] = [
  "Concept",
  "Tool",
  "Author",
  "Book",
  "Problem",
];
const LOCAL_HOST_ALLOWLIST = new Set(["localhost", "127.0.0.1", "::1"]);

const NODE_CREATE_QUERY: Record<SeedNode["nodeType"], string> = {
  Concept: `
    UNWIND $rows AS row
    CREATE (n:Concept {
      id: row.id,
      title: row.title,
      summary: row.summary,
      embedding: row.embedding,
      sourceType: row.sourceType,
      sourceFile: row.sourceFile
    })
  `,
  Tool: `
    UNWIND $rows AS row
    CREATE (n:Tool {
      id: row.id,
      title: row.title,
      summary: row.summary,
      embedding: row.embedding,
      sourceType: row.sourceType,
      sourceFile: row.sourceFile
    })
  `,
  Author: `
    UNWIND $rows AS row
    CREATE (n:Author {
      id: row.id,
      name: row.name,
      summary: row.summary,
      sourceType: row.sourceType,
      sourceFile: row.sourceFile
    })
  `,
  Book: `
    UNWIND $rows AS row
    CREATE (n:Book {
      id: row.id,
      title: row.title,
      summary: row.summary,
      sourceType: row.sourceType,
      sourceFile: row.sourceFile
    })
  `,
  Problem: `
    UNWIND $rows AS row
    CREATE (n:Problem {
      id: row.id,
      title: row.title,
      summary: row.summary,
      embedding: row.embedding,
      sourceType: row.sourceType,
      sourceFile: row.sourceFile
    })
  `,
};

const EDGE_CREATE_QUERY: Record<SeedEdge["type"], string> = {
  WROTE: `
    UNWIND $rows AS row
    MATCH (from {id: row.fromNodeId})
    MATCH (to {id: row.toNodeId})
    CREATE (from)-[:WROTE {sourceType: row.sourceType, sourceFile: row.sourceFile}]->(to)
  `,
  EXPLAINS: `
    UNWIND $rows AS row
    MATCH (from {id: row.fromNodeId})
    MATCH (to {id: row.toNodeId})
    CREATE (from)-[:EXPLAINS {sourceType: row.sourceType, sourceFile: row.sourceFile}]->(to)
  `,
  ADDRESSES: `
    UNWIND $rows AS row
    MATCH (from {id: row.fromNodeId})
    MATCH (to {id: row.toNodeId})
    CREATE (from)-[:ADDRESSES {sourceType: row.sourceType, sourceFile: row.sourceFile}]->(to)
  `,
  RELATES_TO: `
    UNWIND $rows AS row
    MATCH (from {id: row.fromNodeId})
    MATCH (to {id: row.toNodeId})
    CREATE (from)-[:RELATES_TO {sourceType: row.sourceType, sourceFile: row.sourceFile}]->(to)
  `,
  INFLUENCES: `
    UNWIND $rows AS row
    MATCH (from {id: row.fromNodeId})
    MATCH (to {id: row.toNodeId})
    CREATE (from)-[:INFLUENCES {sourceType: row.sourceType, sourceFile: row.sourceFile}]->(to)
  `,
  CONTRASTS_WITH: `
    UNWIND $rows AS row
    MATCH (from {id: row.fromNodeId})
    MATCH (to {id: row.toNodeId})
    CREATE (from)-[:CONTRASTS_WITH {sourceType: row.sourceType, sourceFile: row.sourceFile}]->(to)
  `,
};

/**
 * Asserts that a runtime value is a non-empty string and returns it.
 */
function assertNonEmptyString(value: unknown, fieldName: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Neo4j Seed-Reset/Reseed hat ungueltiges Feld ${fieldName}.`);
  }

  return value;
}

/**
 * Groups items by a computed string key while preserving item order per group.
 */
function groupBy<T, TKey extends string>(
  items: readonly T[],
  getKey: (item: T) => TKey,
): Map<TKey, T[]> {
  const grouped = new Map<TKey, T[]>();

  for (const item of items) {
    const key = getKey(item);
    const group = grouped.get(key);
    if (group) {
      group.push(item);
      continue;
    }

    grouped.set(key, [item]);
  }

  return grouped;
}

/**
 * Creates a deterministic comparison key for a directed edge triple.
 */
function toEdgeKey(edge: Pick<SeedEdge, "type" | "fromNodeId" | "toNodeId">): string {
  return `${edge.type}:${edge.fromNodeId}:${edge.toNodeId}`;
}

/**
 * Creates seed data and applies quality filtering before import.
 */
function createQualitySeedDataset(): SeedDataset {
  const qualityCheck = runSeedDatasetQualityCheck(createSeedDataset());
  return qualityCheck.dataset;
}

/**
 * Restricts destructive reset operations to local Neo4j hosts only.
 */
function assertLocalNeo4jUri(uri: string): void {
  let parsed: URL;
  try {
    parsed = new URL(uri);
  } catch {
    throw new Error("Neo4j Seed-Reset/Reseed erlaubt nur gueltige lokale NEO4J_URI.");
  }

  const host = parsed.hostname.trim().toLowerCase();
  if (!LOCAL_HOST_ALLOWLIST.has(host)) {
    throw new Error(
      "Neo4j Seed-Reset/Reseed ist nur fuer lokale Hosts erlaubt: localhost, 127.0.0.1, ::1.",
    );
  }
}

/**
 * Enforces explicit destructive reset opt-in via environment variable.
 */
function assertDestructiveSeedResetOptIn(optInValue: string | null): void {
  if (optInValue !== "true") {
    throw new Error(
      "Neo4j Seed-Reset/Reseed erfordert ALLOW_DESTRUCTIVE_SEED_RESET=true als explizites Opt-In.",
    );
  }
}

/**
 * Zweck:
 * Fuehrt fuer das lokale Profil einen reproduzierbaren Ablauf aus: Seed-Reset, Reseed und Read-Check.
 *
 * Input:
 * - Runtime-Variablen `NEO4J_URI`, `NEO4J_DATABASE`, `NEO4J_USERNAME`, `NEO4J_PASSWORD`.
 * - Runtime-Variable `ALLOW_DESTRUCTIVE_SEED_RESET=true` als hartes Opt-In.
 * - Optional `driverFactory`, `runtimeRead` und `seedDatasetFactory` fuer Testinjektion.
 *
 * Output:
 * - `LocalSeedResetReseedResult` mit Importanzahl und Read-Check-Kennzahlen.
 *
 * Fehlerfall:
 * - Throwt bei fehlenden Runtime-Variablen, fehlgeschlagenem Import oder wenn Read-Check weniger als zwei Nodes oder zwei Edges liefert.
 *
 * Beispiel:
 * - `const result = await runLocalSeedResetAndReseed()`
 * - `result.readCheckNodeCount >= 2 && result.readCheckEdgeCount >= 2`
 */
export async function runLocalSeedResetAndReseed(
  options: LocalSeedResetReseedOptions = {},
): Promise<LocalSeedResetReseedResult> {
  const env = getQueryRuntimeEnv();
  const uri = assertNonEmptyString(env.neo4jUri, "NEO4J_URI");
  assertLocalNeo4jUri(uri);
  assertDestructiveSeedResetOptIn(env.allowDestructiveSeedReset);
  const username = assertNonEmptyString(env.neo4jUsername, "NEO4J_USERNAME");
  const password = assertNonEmptyString(env.neo4jPassword, "NEO4J_PASSWORD");
  const database = assertNonEmptyString(env.neo4jDatabase, "NEO4J_DATABASE");

  const seedDataset = options.seedDatasetFactory?.() ?? createQualitySeedDataset();
  const runtimeRead = options.runtimeRead ?? (() => readSeedDatasetForRuntime());
  const driverFactory =
    options.driverFactory ??
    ((driverUri: string, driverUser: string, driverPassword: string) =>
      neo4j.driver(driverUri, neo4j.auth.basic(driverUser, driverPassword)));

  const driver = driverFactory(uri, username, password);

  try {
    await driver.verifyConnectivity();

    const session = driver.session({ database });
    try {
      const seedNodeIds = seedDataset.nodes.map((node) => node.id);
      await session.executeWrite(async (transaction) => {
        await transaction.run(
          `
            MATCH (n)
            WHERE n.id IN $seedNodeIds
            DETACH DELETE n
          `,
          { seedNodeIds },
        );

        const nodesByType = groupBy(seedDataset.nodes, (node) => node.nodeType);
        for (const [nodeType, rows] of nodesByType) {
          await transaction.run(NODE_CREATE_QUERY[nodeType], { rows });
        }

        const edgesByType = groupBy(seedDataset.edges, (edge) => edge.type);
        for (const [edgeType, rows] of edgesByType) {
          await transaction.run(EDGE_CREATE_QUERY[edgeType], { rows });
        }
      });
    } finally {
      await session.close();
    }

    const runtimeDataset = await runtimeRead();
    if (runtimeDataset.nodes.length < 2) {
      throw new Error("Read-Check nach Reseed erwartet mindestens zwei Nodes.");
    }

    if (runtimeDataset.edges.length < 2) {
      throw new Error("Read-Check nach Reseed erwartet mindestens zwei Relationen.");
    }

    const expectedNodeIds = seedDataset.nodes.slice(0, 2).map((node) => node.id);
    for (const expectedNodeId of expectedNodeIds) {
      const found = runtimeDataset.nodes.some((node) => node.id === expectedNodeId);
      if (!found) {
        throw new Error(`Read-Check nach Reseed findet erwartete Node ${expectedNodeId} nicht.`);
      }
    }

    const expectedEdgeKeys = seedDataset.edges.slice(0, 2).map((edge) => toEdgeKey(edge));
    for (const expectedEdgeKey of expectedEdgeKeys) {
      const found = runtimeDataset.edges.some((edge) => toEdgeKey(edge) === expectedEdgeKey);
      if (!found) {
        throw new Error(`Read-Check nach Reseed findet erwartete Relation ${expectedEdgeKey} nicht.`);
      }
    }

    return {
      deletedAllowedNodeTypes: [...ALLOWED_NODE_TYPES],
      insertedNodeCount: seedDataset.nodes.length,
      insertedEdgeCount: seedDataset.edges.length,
      readCheckNodeCount: runtimeDataset.nodes.length,
      readCheckEdgeCount: runtimeDataset.edges.length,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Neo4j Seed-Reset/Reseed fehlgeschlagen: ${error.message}`);
    }

    throw new Error("Neo4j Seed-Reset/Reseed fehlgeschlagen.");
  } finally {
    await driver.close();
  }
}
