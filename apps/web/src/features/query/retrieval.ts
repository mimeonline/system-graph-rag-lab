import neo4j from "neo4j-driver";
import { createSeedDataset } from "@/features/seed-data/seed-data";
import type {
  CuratedSourceEntry,
  PublicReference,
  SeedEdge,
  SeedNode,
  SeedSourceType,
} from "@/features/seed-data/seed-data";
import type { QueryRuntimeEnv } from "@/lib/env";
import {
  CONTEXT_BUDGET_TOKENS,
  HOP_DEPTH,
  TOP_K,
  type QueryContextElement,
  type QueryReferenceLink,
  type QueryReference,
} from "@/features/query/contracts";

const OPENAI_EMBEDDINGS_ENDPOINT = "https://api.openai.com/v1/embeddings";
const GRAPH_VECTOR_SEARCH_LIMIT = TOP_K * 2;
const GRAPH_NEIGHBOR_LIMIT_PER_CANDIDATE = 3;
const TOOL_LINK_LIMIT_PER_REFERENCE = 3;
const CONTEXT_SUMMARY_LIMIT = 280;
const SOURCE_KEY_DELIMITER = "|";
const DEFAULT_NEO4J_VECTOR_INDEX_NAME = "node_embedding_index";
const GRAPH_VECTOR_SEARCH_QUERY = `
  CALL db.index.vector.queryNodes(
    $vectorIndex,
    $topK,
    $vector
  )
  YIELD node, score
  RETURN node.id AS nodeId,
         node.title AS title,
         node.name AS name,
         node.summary AS summary,
         node.sourceType AS sourceType,
         node.sourceFile AS sourceFile,
         score
  ORDER BY score DESC
`;

const GRAPH_NEIGHBOR_QUERY = `
  UNWIND $parentIds AS parentId
  CALL {
    WITH parentId
    MATCH (parent {id: parentId})-[rel]-(neighbor)
    WHERE neighbor.id IS NOT NULL AND neighbor.id <> parentId
    RETURN parentId, neighbor.id AS neighborId
    LIMIT $neighborLimit
  }
  RETURN parentId, neighborId
`;

type QueryCandidate = {
  nodeId: string;
  nodeType: QueryReference["nodeType"];
  title: string;
  summary: string;
  sourceType: SeedSourceType;
  sourceFile: string;
  publicReference: PublicReference;
  hop: number;
  tokenSet: Set<string>;
  contextTokens: number;
};

export type RetrievalResult = {
  references: QueryReference[];
  contextTokens: number;
  contextElements: QueryContextElement[];
};

export class GraphBackendUnavailableError extends Error {
  constructor() {
    super("Graph backend nicht erreichbar.");
  }
}

class GraphIndexUnavailableError extends Error {
  constructor() {
    super("Vector-Index nicht verfügbar.");
  }
}

const seedDataset = createSeedDataset();
const SOURCE_LOOKUP = buildSourceLookup(seedDataset.sources);
const SEED_NODE_LOOKUP = new Map(seedDataset.nodes.map((node) => [node.id, node]));
const NEIGHBOR_IDS_BY_NODE_ID = buildNeighborMap(seedDataset.edges);
const SEARCH_INDEX = seedDataset.nodes.map((node) => buildCandidateFromSeedNode(node, 0));

/**
 * Normalizes text for accent-insensitive and case-insensitive matching.
 */
function normalizeText(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

/**
 * Extracts normalized tokens for retrieval scoring.
 */
function extractTokens(value: string): string[] {
  const normalized = normalizeText(value);
  const fragments = normalized.match(/[a-z0-9]+/g) ?? [];
  return fragments.filter((fragment) => fragment.length >= 2);
}

/**
 * Builds a deduplicated token set from the input text.
 */
function buildTokenSet(value: string): Set<string> {
  return new Set(extractTokens(value));
}

/**
 * Estimates token count with a lightweight heuristic.
 */
function estimateTokenCount(value: string): number {
  if (!value) {
    return 0;
  }

  return Math.ceil(value.length / 4);
}

/**
 * Truncates summaries to a fixed limit.
 */
function truncateSummary(value: string): string {
  const trimmed = value.trim();
  if (trimmed.length <= CONTEXT_SUMMARY_LIMIT) {
    return trimmed;
  }

  return `${trimmed.slice(0, CONTEXT_SUMMARY_LIMIT - 3)}...`;
}

/**
 * Builds a deterministic lookup key for sources.
 */
function getSourceLookupKey(sourceType: SeedSourceType, sourceFile: string): string {
  return `${sourceType}${SOURCE_KEY_DELIMITER}${sourceFile}`;
}

/**
 * Indexes curated sources by source type + file.
 */
function buildSourceLookup(sources: CuratedSourceEntry[]): Map<string, CuratedSourceEntry> {
  const lookup = new Map<string, CuratedSourceEntry>();
  for (const source of sources) {
    lookup.set(getSourceLookupKey(source.sourceType, source.sourceFile), source);
  }

  return lookup;
}

/**
 * Builds undirected neighbor lists for node ids from seed edges.
 */
function buildNeighborMap(edges: SeedEdge[]): Map<string, string[]> {
  const map = new Map<string, Set<string>>();
  for (const edge of edges) {
    if (!map.has(edge.fromNodeId)) {
      map.set(edge.fromNodeId, new Set<string>());
    }
    if (!map.has(edge.toNodeId)) {
      map.set(edge.toNodeId, new Set<string>());
    }

    map.get(edge.fromNodeId)?.add(edge.toNodeId);
    map.get(edge.toNodeId)?.add(edge.fromNodeId);
  }

  return new Map(
    [...map.entries()].map(([nodeId, neighbors]) => [nodeId, [...neighbors].sort()]),
  );
}

/**
 * Builds a candidate from a seed node.
 */
function buildCandidateFromSeedNode(node: SeedNode, hop: number): QueryCandidate {
  const displayTitle = node.title ?? node.name ?? "Unbekannter Knoten";
  const combinedText = `${displayTitle} ${node.summary}`;

  return {
    nodeId: node.id,
    nodeType: node.nodeType as QueryReference["nodeType"],
    title: displayTitle,
    summary: node.summary,
    sourceType: node.sourceType,
    sourceFile: node.sourceFile,
    publicReference: node.publicReference,
    hop,
    tokenSet: buildTokenSet(combinedText),
    contextTokens: estimateTokenCount(displayTitle) + estimateTokenCount(node.summary),
  };
}

/**
 * Determines ordering for lexical candidates.
 */
function compareCandidates(
  a: QueryCandidate,
  b: QueryCandidate,
  scoreA: number,
  scoreB: number,
): number {
  if (scoreA !== scoreB) {
    return scoreB - scoreA;
  }

  if (a.hop !== b.hop) {
    return a.hop - b.hop;
  }

  if (a.nodeType !== b.nodeType) {
    return a.nodeType.localeCompare(b.nodeType);
  }

  return a.nodeId.localeCompare(b.nodeId);
}

/**
 * Computes overlap score for lexical retrieval.
 */
function computeScore(tokenSet: Set<string>, queryTokens: string[]): number {
  if (queryTokens.length === 0) {
    return 0;
  }

  let matches = 0;
  for (const token of queryTokens) {
    if (tokenSet.has(token)) {
      matches += 1;
    }
  }

  return Number(matches.toFixed(6));
}

/**
 * Builds a context element from a candidate.
 */
function buildContextElement(
  candidate: QueryCandidate,
  sourceKind: "candidate" | "extension",
  candidateId: string,
): QueryContextElement {
  const sourceKey = getSourceLookupKey(candidate.sourceType, candidate.sourceFile);
  const curatedSource = SOURCE_LOOKUP.get(sourceKey);

  return {
    nodeId: candidate.nodeId,
    nodeType: candidate.nodeType,
    title: candidate.title,
    summary: truncateSummary(candidate.summary),
    source: {
      kind: sourceKind,
      candidateId,
      sourceId: curatedSource?.sourceId,
      sourceFile: candidate.sourceFile,
      sourceType: candidate.sourceType,
      publicReference: candidate.publicReference,
    },
  };
}

/**
 * Builds explanation and tool links for a reference from graph neighbors.
 */
function buildReferenceLinks(candidate: QueryCandidate): {
  citation: string;
  explanationUrl?: string;
  toolLinks: QueryReferenceLink[];
} {
  const citation = candidate.publicReference.citation.trim();
  const explanationUrl = candidate.publicReference.url;
  const neighborIds = NEIGHBOR_IDS_BY_NODE_ID.get(candidate.nodeId) ?? [];
  const toolLinks: QueryReferenceLink[] = [];

  for (const neighborId of neighborIds) {
    const neighbor = SEED_NODE_LOOKUP.get(neighborId);
    if (!neighbor || neighbor.nodeType !== "Tool") {
      continue;
    }

    const toolUrl = neighbor.publicReference.url;
    if (!toolUrl) {
      continue;
    }

    const toolTitle = neighbor.title ?? neighbor.name ?? neighbor.id;
    toolLinks.push({
      label: toolTitle,
      url: toolUrl,
    });

    if (toolLinks.length >= TOOL_LINK_LIMIT_PER_REFERENCE) {
      break;
    }
  }

  if (candidate.nodeType === "Tool" && candidate.publicReference.url) {
    const ownLabel = candidate.title;
    if (!toolLinks.some((link) => link.label === ownLabel && link.url === candidate.publicReference.url)) {
      toolLinks.unshift({
        label: ownLabel,
        url: candidate.publicReference.url,
      });
    }
  }

  return {
    citation: citation.length > 0 ? citation : "Kuratierte Quelle",
    explanationUrl,
    toolLinks,
  };
}

function buildReferenceFromCandidate(candidate: QueryCandidate, score: number): QueryReference {
  const links = buildReferenceLinks(candidate);

  return {
    nodeId: candidate.nodeId,
    nodeType: candidate.nodeType,
    title: candidate.title,
    score,
    hop: candidate.hop,
    citation: links.citation,
    explanationUrl: links.explanationUrl,
    toolLinks: links.toolLinks,
  };
}

/**
 * Lexical fallback for when graph retrieval is unavailable.
 */
function buildLexicalContextCandidates(query: string): RetrievalResult {
  const queryTokens = extractTokens(query);
  const scoredEntries = SEARCH_INDEX.map((entry) => ({
    entry,
    score: computeScore(entry.tokenSet, queryTokens),
  }));

  scoredEntries.sort((left, right) =>
    compareCandidates(left.entry, right.entry, left.score, right.score),
  );

  const references: QueryReference[] = [];
  const contextElements: QueryContextElement[] = [];
  const selectedNodeIds = new Set<string>();
  let totalContextTokens = 0;

  for (const candidate of scoredEntries) {
    if (references.length >= TOP_K) {
      break;
    }

    if (selectedNodeIds.has(candidate.entry.nodeId)) {
      continue;
    }

    if (totalContextTokens + candidate.entry.contextTokens > CONTEXT_BUDGET_TOKENS) {
      continue;
    }

    references.push({
      ...buildReferenceFromCandidate(candidate.entry, candidate.score),
    });

    contextElements.push(buildContextElement(candidate.entry, "candidate", candidate.entry.nodeId));
    selectedNodeIds.add(candidate.entry.nodeId);
    totalContextTokens += candidate.entry.contextTokens;
  }

  return {
    references,
    contextTokens: totalContextTokens,
    contextElements,
  };
}

/**
 * Determines whether graph retrieval is configured.
 */
function getNeo4jVectorIndexName(env: QueryRuntimeEnv): string {
  return env.neo4jVectorIndexName ?? DEFAULT_NEO4J_VECTOR_INDEX_NAME;
}

function canUseGraphRetrieval(env: QueryRuntimeEnv): boolean {
  return Boolean(
    env.neo4jUri &&
      env.neo4jDatabase &&
      env.neo4jUsername &&
      env.neo4jPassword &&
      env.openAiApiKey &&
      env.openAiEmbeddingsModel &&
      getNeo4jVectorIndexName(env),
  );
}

/**
 * Main entry point for query retrieval.
 */
export async function buildContextCandidates(
  query: string,
  env?: QueryRuntimeEnv,
): Promise<RetrievalResult> {
  if (!env || !canUseGraphRetrieval(env)) {
    return buildLexicalContextCandidates(query);
  }

  try {
    return await buildGraphContextCandidates(query, env);
  } catch (error) {
    if (error instanceof GraphIndexUnavailableError) {
      return buildLexicalContextCandidates(query);
    }

    if (error instanceof GraphBackendUnavailableError) {
      throw error;
    }

    throw error;
  }
}

/**
 * Performs graph-based retrieval via embeddings + Neo4j vector index.
 */
async function buildGraphContextCandidates(query: string, env: QueryRuntimeEnv): Promise<RetrievalResult> {
  const vector = await fetchQueryEmbedding({
    apiKey: env.openAiApiKey!,
    model: env.openAiEmbeddingsModel!,
    query,
  });

  const driver = neo4j.driver(
    env.neo4jUri!,
    neo4j.auth.basic(env.neo4jUsername!, env.neo4jPassword!),
  );

  try {
    const session = driver.session({ database: env.neo4jDatabase! });
    try {
      const vectorIndexName = getNeo4jVectorIndexName(env);

      const vectorResult = await session.run(GRAPH_VECTOR_SEARCH_QUERY, {
        vectorIndex: vectorIndexName,
        topK: GRAPH_VECTOR_SEARCH_LIMIT,
        vector,
      });

      const references: QueryReference[] = [];
      const contextElements: QueryContextElement[] = [];
      const selectedNodeIds = new Set<string>();
      let totalContextTokens = 0;
      const referenceParents: string[] = [];

      for (const record of vectorResult.records) {
        if (references.length >= TOP_K) {
          break;
        }

        const nodeId = record.get("nodeId") as string | undefined;
        if (!nodeId || selectedNodeIds.has(nodeId)) {
          continue;
        }

        const seedNode = SEED_NODE_LOOKUP.get(nodeId);
        if (!seedNode) {
          continue;
        }

        const candidate = buildCandidateFromSeedNode(seedNode, 0);
        if (totalContextTokens + candidate.contextTokens > CONTEXT_BUDGET_TOKENS) {
          continue;
        }

        references.push({
          ...buildReferenceFromCandidate(candidate, normalizeNumber(record.get("score"))),
        });

        contextElements.push(buildContextElement(candidate, "candidate", candidate.nodeId));
        selectedNodeIds.add(candidate.nodeId);
        totalContextTokens += candidate.contextTokens;
        referenceParents.push(candidate.nodeId);
      }

      if (HOP_DEPTH > 0 && referenceParents.length > 0) {
        const neighborResult = await session.run(GRAPH_NEIGHBOR_QUERY, {
          parentIds: [...new Set(referenceParents)],
          neighborLimit: GRAPH_NEIGHBOR_LIMIT_PER_CANDIDATE,
        });

        for (const neighborRecord of neighborResult.records) {
          const neighborId = neighborRecord.get("neighborId") as string | undefined;
          const parentId = neighborRecord.get("parentId") as string | undefined;
          if (!neighborId || !parentId || selectedNodeIds.has(neighborId)) {
            continue;
          }

          const neighborNode = SEED_NODE_LOOKUP.get(neighborId);
          if (!neighborNode) {
            continue;
          }

          const neighborCandidate = buildCandidateFromSeedNode(neighborNode, 1);
          if (totalContextTokens + neighborCandidate.contextTokens > CONTEXT_BUDGET_TOKENS) {
            continue;
          }

          contextElements.push(
            buildContextElement(neighborCandidate, "extension", parentId),
          );
          selectedNodeIds.add(neighborId);
          totalContextTokens += neighborCandidate.contextTokens;
        }
      }

      return {
        references,
        contextTokens: totalContextTokens,
        contextElements,
      };
    } catch (error) {
      if (isNeo4jIndexError(error)) {
        throw new GraphIndexUnavailableError();
      }

      throw new GraphBackendUnavailableError();
    } finally {
      await session.close();
    }
  } catch (error) {
    if (error instanceof GraphIndexUnavailableError || error instanceof GraphBackendUnavailableError) {
      throw error;
    }

    if (isNeo4jIndexError(error)) {
      throw new GraphIndexUnavailableError();
    }

    throw new GraphBackendUnavailableError();
  } finally {
    await driver.close();
  }
}

/**
 * Calls OpenAI to generate an embedding for the query.
 */
async function fetchQueryEmbedding(options: {
  apiKey: string;
  model: string;
  query: string;
}): Promise<number[]> {
  const { apiKey, model, query } = options;

  let response: Response;
  try {
    response = await fetch(OPENAI_EMBEDDINGS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        input: query,
      }),
    });
  } catch {
    throw new GraphBackendUnavailableError();
  }

  if (!response.ok) {
    throw new GraphBackendUnavailableError();
  }

  const payload = (await response.json()) as {
    data?: Array<{ embedding?: number[] }>;
  };

  const embedding = payload.data?.[0]?.embedding;
  if (!Array.isArray(embedding) || embedding.length === 0) {
    throw new GraphBackendUnavailableError();
  }

  return embedding;
}

/**
 * Normalizes Neo4j numeric types to native numbers.
 */
function normalizeNumber(value: unknown): number {
  if (value === null || value === undefined) {
    return 0;
  }

  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "bigint") {
    return Number(value);
  }

  if (typeof value === "object" && "toNumber" in value && typeof value["toNumber"] === "function") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (value as { toNumber: () => number }).toNumber();
  }

  return 0;
}

/**
 * Determines if an error should trigger the lexical fallback.
 */
function isNeo4jIndexError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  const candidate = error as { code?: string };
  if (!candidate.code) {
    return false;
  }

  return (
    candidate.code.startsWith("Neo.ClientError.Schema.Index") ||
    candidate.code.startsWith("Neo.ClientError.Procedure")
  );
}
