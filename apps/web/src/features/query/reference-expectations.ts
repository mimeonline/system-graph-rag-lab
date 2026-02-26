const EXPECTED_REFERENCES_BY_QUERY: Record<string, string[]> = {
  "wie wirken feedback loops auf lokale optimierung in komplexen systemen?": [
    "concept:feedback_loops",
    "problem:local_optimization",
    "concept:leverage_points",
  ],
  "welche rolle spielen leverage points fuer nachhaltige systemveraenderung?": [
    "concept:leverage_points",
    "book:thinking_in_systems",
    "concept:feedback_loops",
  ],
  "wie unterscheiden sich verstaerkende und ausgleichende rueckkopplungen?": [
    "concept:feedback_loops",
    "concept:contrasts_with",
    "concept:system_behavior",
  ],
  "warum scheitert lokale optimierung haeufig auf gesamtsystemebene?": [
    "problem:local_optimization",
    "concept:feedback_loops",
    "concept:system_boundary",
  ],
  "wie hilft system thinking bei der priorisierung von interventionen?": [
    "concept:leverage_points",
    "concept:system_boundary",
    "book:thinking_in_systems",
  ],
};

const NORMALIZE_PATTERN = /\s+/g;

function normalizeQuestion(query: string): string {
  return query.trim().toLowerCase().replace(NORMALIZE_PATTERN, " ");
}

export type ExpectationCheckResult = {
  expectedReferenceIds: string[];
  matchedCount: number;
};

export function getExpectedReferencesForQuery(query: string): string[] {
  return EXPECTED_REFERENCES_BY_QUERY[normalizeQuestion(query)] ?? [];
}

export function evaluateExpectationMatch(
  query: string,
  referenceIds: string[],
): ExpectationCheckResult {
  const expectedReferenceIds = getExpectedReferencesForQuery(query);
  if (expectedReferenceIds.length === 0) {
    return { expectedReferenceIds, matchedCount: 0 };
  }

  const expectedSet = new Set(expectedReferenceIds.map((reference) => reference.toLowerCase()));
  const matchedCount = referenceIds.reduce((matches, referenceId) => {
    if (expectedSet.has(referenceId.toLowerCase())) {
      return matches + 1;
    }
    return matches;
  }, 0);

  return { expectedReferenceIds, matchedCount };
}

export const EXPECTATION_FALLBACK_PREFIX = "Hinweis: Unter den ersten drei Referenzen";

export function buildExpectationFallbackHint(
  query: string,
  matchedCount: number,
  expectedReferenceIds: string[],
): string | null {
  if (expectedReferenceIds.length === 0 || matchedCount >= 2) {
    return null;
  }

  const listPreview =
    expectedReferenceIds.length > 3
      ? `${expectedReferenceIds.slice(0, 3).join(", ")}...`
      : expectedReferenceIds.join(", ");

  return `${EXPECTATION_FALLBACK_PREFIX} von "${query}" befinden sich nur ${matchedCount} der erwarteten Konzepte (${listPreview}). Bitte füge mehr Kontext hinzu oder korrigiere die Frageformulierung.`;
}
