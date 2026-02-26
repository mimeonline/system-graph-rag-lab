import { createSeedDataset } from "@/features/seed-data/seed-data";
import {
  CONTEXT_BUDGET_TOKENS,
  TOP_K,
  type QueryReference,
} from "@/features/query/contracts";

type NodeSearchEntry = {
  nodeId: string;
  nodeType: QueryReference["nodeType"];
  title: string;
  summary: string;
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

const seedDataset = createSeedDataset();

const SEARCH_INDEX: NodeSearchEntry[] = seedDataset.nodes.map((node) => {
  const displayTitle = node.title ?? node.name ?? "Unbekannter Knoten";
  const combinedText = `${displayTitle} ${node.summary}`;
  return {
    nodeId: node.id,
    nodeType: node.nodeType,
    title: displayTitle,
    summary: node.summary,
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
  let totalContextTokens = 0;

  for (const candidate of scoredEntries) {
    if (references.length >= TOP_K) {
      break;
    }

    const nextTokenBudget = totalContextTokens + candidate.entry.contextTokens;
    if (nextTokenBudget > CONTEXT_BUDGET_TOKENS) {
      continue;
    }

    references.push({
      nodeId: candidate.entry.nodeId,
      nodeType: candidate.entry.nodeType,
      title: candidate.entry.title,
      score: candidate.score,
      hop: candidate.entry.hop,
    });

    totalContextTokens = nextTokenBudget;
  }

  return {
    references,
    contextTokens: totalContextTokens,
  };
}
