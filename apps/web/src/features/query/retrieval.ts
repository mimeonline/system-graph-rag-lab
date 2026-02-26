import { createSeedDataset } from "@/features/seed-data/seed-data";
import type {
  CuratedSourceEntry,
  PublicReference,
  SeedSourceType,
} from "@/features/seed-data/seed-data";
import {
  CONTEXT_BUDGET_TOKENS,
  TOP_K,
  type QueryContextElement,
  type QueryContextElementSource,
  type QueryReference,
} from "@/features/query/contracts";

type NodeSearchEntry = {
  nodeId: string;
  nodeType: QueryReference["nodeType"];
  title: string;
  summary: string;
  sourceType: SeedSourceType;
  sourceFile: string;
  publicReference: PublicReference;
  tokenSet: Set<string>;
  contextTokens: number;
  hop: number;
};

const ESTIMATED_TOKEN_DIVISOR = 4;
const MIN_TOKEN_LENGTH = 2;

function normalizeText(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

function extractTokens(value: string): string[] {
  const normalized = normalizeText(value);
  const fragments = normalized.match(/[a-z0-9]+/g) ?? [];
  return fragments.filter((fragment) => fragment.length >= MIN_TOKEN_LENGTH);
}

function buildTokenSet(value: string): Set<string> {
  return new Set(extractTokens(value));
}

function estimateTokenCount(value: string): number {
  if (!value) {
    return 0;
  }

  return Math.ceil(value.length / ESTIMATED_TOKEN_DIVISOR);
}

const CONTEXT_SUMMARY_LIMIT = 280;
const SOURCE_KEY_DELIMITER = "|";

function getSourceLookupKey(sourceType: SeedSourceType, sourceFile: string): string {
  return `${sourceType}${SOURCE_KEY_DELIMITER}${sourceFile}`;
}

function buildSourceLookup(sources: CuratedSourceEntry[]): Map<string, CuratedSourceEntry> {
  const lookup = new Map<string, CuratedSourceEntry>();
  for (const source of sources) {
    lookup.set(getSourceLookupKey(source.sourceType, source.sourceFile), source);
  }

  return lookup;
}

function truncateSummary(value: string): string {
  const trimmed = value.trim();
  if (trimmed.length <= CONTEXT_SUMMARY_LIMIT) {
    return trimmed;
  }

  return `${trimmed.slice(0, CONTEXT_SUMMARY_LIMIT - 3)}...`;
}

const seedDataset = createSeedDataset();
const SOURCE_LOOKUP = buildSourceLookup(seedDataset.sources);

const SEARCH_INDEX: NodeSearchEntry[] = seedDataset.nodes.map((node) => {
  const displayTitle = node.title ?? node.name ?? "Unbekannter Knoten";
  const combinedText = `${displayTitle} ${node.summary}`;
  return {
    nodeId: node.id,
    nodeType: node.nodeType,
    title: displayTitle,
    summary: node.summary,
    sourceType: node.sourceType,
    sourceFile: node.sourceFile,
    publicReference: node.publicReference,
    tokenSet: buildTokenSet(combinedText),
    contextTokens: estimateTokenCount(displayTitle) + estimateTokenCount(node.summary),
    hop: 0,
  };
});

function compareCandidates(a: NodeSearchEntry, b: NodeSearchEntry, scoreA: number, scoreB: number): number {
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

export type RetrievalResult = {
  references: QueryReference[];
  contextTokens: number;
  contextElements: QueryContextElement[];
};

export function buildContextCandidates(query: string): RetrievalResult {
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

    const nextTokenBudget = totalContextTokens + candidate.entry.contextTokens;
    if (nextTokenBudget > CONTEXT_BUDGET_TOKENS) {
      continue;
    }

    if (selectedNodeIds.has(candidate.entry.nodeId)) {
      continue;
    }

    references.push({
      nodeId: candidate.entry.nodeId,
      nodeType: candidate.entry.nodeType,
      title: candidate.entry.title,
      score: candidate.score,
      hop: candidate.entry.hop,
    });

    contextElements.push(buildContextElement(candidate.entry));
    selectedNodeIds.add(candidate.entry.nodeId);

    totalContextTokens = nextTokenBudget;
  }

  return {
    references,
    contextTokens: totalContextTokens,
    contextElements,
  };
}

function buildContextElement(entry: NodeSearchEntry): QueryContextElement {
  const sourceKey = getSourceLookupKey(entry.sourceType, entry.sourceFile);
  const curatedSource = SOURCE_LOOKUP.get(sourceKey);

  return {
    nodeId: entry.nodeId,
    nodeType: entry.nodeType,
    title: entry.title,
    summary: truncateSummary(entry.summary),
    source: {
      kind: "candidate",
      candidateId: entry.nodeId,
      sourceId: curatedSource?.sourceId,
      sourceFile: entry.sourceFile,
      sourceType: entry.sourceType,
      publicReference: entry.publicReference,
    },
  };
}
