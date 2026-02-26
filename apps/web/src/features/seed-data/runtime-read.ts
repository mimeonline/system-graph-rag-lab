import neo4j, { type Driver } from "neo4j-driver";
import { getQueryRuntimeEnv } from "@/lib/env";
import { type SeedEdge, type SeedNode, type SeedSourceType } from "@/features/seed-data/seed-data";

export type RuntimeSeedReadNode = Pick<
  SeedNode,
  "id" | "nodeType" | "title" | "name" | "summary" | "sourceType" | "sourceFile"
>;

export type RuntimeSeedReadEdge = Pick<
  SeedEdge,
  "type" | "fromNodeId" | "toNodeId" | "sourceType" | "sourceFile"
>;

export type RuntimeSeedReadResult = {
  nodes: RuntimeSeedReadNode[];
  edges: RuntimeSeedReadEdge[];
};

const ALLOWED_NODE_TYPES = ["Concept", "Tool", "Author", "Book", "Problem"] as const;
const ALLOWED_EDGE_TYPES = [
  "WROTE",
  "EXPLAINS",
  "ADDRESSES",
  "RELATES_TO",
  "INFLUENCES",
  "CONTRASTS_WITH",
] as const;
const ALLOWED_SOURCE_TYPES: readonly SeedSourceType[] = ["primary_md", "optional_internet"];

type RuntimeSeedReadOptions = {
  driverFactory?: (uri: string, username: string, password: string) => Driver;
};

/**
 * Type guard for accepted source types returned by runtime reads.
 */
function isAllowedSourceType(sourceType: unknown): sourceType is SeedSourceType {
  return typeof sourceType === "string" && ALLOWED_SOURCE_TYPES.includes(sourceType as SeedSourceType);
}

/**
 * Asserts that a runtime value is a non-empty string and returns it.
 */
function assertNonEmptyString(value: unknown, fieldName: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Neo4j Runtime-Read hat ungueltiges Feld ${fieldName}.`);
  }

  return value;
}

/**
 * Zweck:
 * Liest die normalisierte Seed-Datenbasis als echte Runtime-Reads direkt aus Neo4j.
 *
 * Input:
 * - options.driverFactory: optionaler Driver-Hook fuer Tests, Default nutzt neo4j-driver.
 *
 * Output:
 * - RuntimeSeedReadResult mit Nodes und Relationen inklusive sourceType/sourceFile.
 *
 * Fehlerfall:
 * - Throwt Error bei fehlender Neo4j Konfiguration, Verbindungsproblemen oder ungueltigen Datenfeldern.
 *
 * Beispiel:
 * - const result = await readSeedDatasetForRuntime()
 * - result.nodes[0].sourceType ist primary_md oder optional_internet
 */
export async function readSeedDatasetForRuntime(
  options: RuntimeSeedReadOptions = {},
): Promise<RuntimeSeedReadResult> {
  const env = getQueryRuntimeEnv();
  const uri = assertNonEmptyString(env.neo4jUri, "NEO4J_URI");
  const username = assertNonEmptyString(env.neo4jUsername, "NEO4J_USERNAME");
  const password = assertNonEmptyString(env.neo4jPassword, "NEO4J_PASSWORD");
  const database = assertNonEmptyString(env.neo4jDatabase, "NEO4J_DATABASE");

  const driverFactory =
    options.driverFactory ??
    ((driverUri: string, driverUser: string, driverPassword: string) =>
      neo4j.driver(driverUri, neo4j.auth.basic(driverUser, driverPassword)));
  const driver = driverFactory(uri, username, password);

  try {
    await driver.verifyConnectivity();

    const session = driver.session({ database });
    try {
      const nodeResult = await session.run(
        `
          MATCH (n)
          WHERE any(label IN labels(n) WHERE label IN $allowedNodeTypes)
          RETURN
            n.id AS id,
            labels(n)[0] AS nodeType,
            n.title AS title,
            n.name AS name,
            n.summary AS summary,
            n.sourceType AS sourceType,
            n.sourceFile AS sourceFile
          ORDER BY id ASC
        `,
        { allowedNodeTypes: [...ALLOWED_NODE_TYPES] },
      );

      const edgeResult = await session.run(
        `
          MATCH (from)-[r]->(to)
          WHERE any(label IN labels(from) WHERE label IN $allowedNodeTypes)
            AND any(label IN labels(to) WHERE label IN $allowedNodeTypes)
            AND type(r) IN $allowedEdgeTypes
          RETURN
            type(r) AS type,
            from.id AS fromNodeId,
            to.id AS toNodeId,
            r.sourceType AS sourceType,
            r.sourceFile AS sourceFile
          ORDER BY type ASC, fromNodeId ASC, toNodeId ASC
        `,
        {
          allowedNodeTypes: [...ALLOWED_NODE_TYPES],
          allowedEdgeTypes: [...ALLOWED_EDGE_TYPES],
        },
      );

      const nodes = nodeResult.records.map((record) => {
        const sourceType = record.get("sourceType");
        if (!isAllowedSourceType(sourceType)) {
          throw new Error(`Neo4j Runtime-Read hat ungueltiges sourceType fuer Node ${record.get("id")}.`);
        }

        return {
          id: assertNonEmptyString(record.get("id"), "nodes.id"),
          nodeType: assertNonEmptyString(record.get("nodeType"), "nodes.nodeType") as SeedNode["nodeType"],
          title: typeof record.get("title") === "string" ? record.get("title") : undefined,
          name: typeof record.get("name") === "string" ? record.get("name") : undefined,
          summary: assertNonEmptyString(record.get("summary"), "nodes.summary"),
          sourceType,
          sourceFile: assertNonEmptyString(record.get("sourceFile"), "nodes.sourceFile"),
        } satisfies RuntimeSeedReadNode;
      });

      const edges = edgeResult.records.map((record) => {
        const sourceType = record.get("sourceType");
        if (!isAllowedSourceType(sourceType)) {
          throw new Error(`Neo4j Runtime-Read hat ungueltiges sourceType fuer Edge ${record.get("type")}.`);
        }

        return {
          type: assertNonEmptyString(record.get("type"), "edges.type") as SeedEdge["type"],
          fromNodeId: assertNonEmptyString(record.get("fromNodeId"), "edges.fromNodeId"),
          toNodeId: assertNonEmptyString(record.get("toNodeId"), "edges.toNodeId"),
          sourceType,
          sourceFile: assertNonEmptyString(record.get("sourceFile"), "edges.sourceFile"),
        } satisfies RuntimeSeedReadEdge;
      });

      return { nodes, edges };
    } finally {
      await session.close();
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Neo4j Runtime-Read fehlgeschlagen: ${error.message}`);
    }

    throw new Error("Neo4j Runtime-Read fehlgeschlagen.");
  } finally {
    await driver.close();
  }
}
