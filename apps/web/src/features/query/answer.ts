import {
  type QueryContextElement,
  type QueryReference,
  type QuerySuccessResponse,
} from "@/features/query/contracts";
import {
  buildExpectationFallbackHint,
  evaluateExpectationMatch,
} from "@/features/query/reference-expectations";

export const MAX_REFERENCES_IN_RESPONSE = 3;
const ESTIMATED_TOKEN_DIVISOR = 4;

export type BuildStructuredAnswerInput = {
  query: string;
  references: QueryReference[];
  contextElements: QueryContextElement[];
};

export type BuildStructuredAnswerResult = {
  answer: QuerySuccessResponse["answer"];
  references: QueryReference[];
  contextElements: QueryContextElement[];
  contextTokens: number;
};

/**
 * Estimates token count from text length using a conservative heuristic.
 */
function estimateTokensFromText(value: string): number {
  if (!value) {
    return 0;
  }

  return Math.ceil(value.length / ESTIMATED_TOKEN_DIVISOR);
}

/**
 * Joins concept titles into a German-readable list with proper conjunction.
 */
function formatConceptList(titles: string[]): string {
  if (titles.length === 0) {
    return "";
  }

  if (titles.length === 1) {
    return titles[0];
  }

  if (titles.length === 2) {
    return `${titles[0]} und ${titles[1]}`;
  }

  const last = titles.at(-1);
  const initial = titles.slice(0, -1).join(", ");
  return `${initial} und ${last}`;
}

/**
 * Builds the final structured answer with capped references and context rationale.
 */
export function buildStructuredAnswer({
  query,
  references,
  contextElements,
}: BuildStructuredAnswerInput): BuildStructuredAnswerResult {
  const candidateReferences = references.slice(0, MAX_REFERENCES_IN_RESPONSE);
  const alignedCount = Math.min(candidateReferences.length, contextElements.length);
  const finalReferences = candidateReferences.slice(0, alignedCount);
  const finalContextElements = contextElements.slice(0, finalReferences.length);

  if (finalReferences.length === 0) {
    const fallbackMain = query
      ? `Für "${query}" konnte aus dem vorliegenden Kontext keine Antwort generiert werden.`
      : "Für die aktuelle Frage konnte aus dem Kontext keine Antwort generiert werden.";
    const fallbackRationale =
      "Bitte formuliere die Frage präziser oder liefere mehr Kontext, damit relevante Konzepte identifiziert werden können.";

    return {
      answer: {
        main: fallbackMain,
        coreRationale: fallbackRationale,
      },
      references: [],
      contextElements: [],
      contextTokens: 0,
    };
  }

  const quotedTitles = finalReferences.map((reference) => `«${reference.title}»`);
  const conceptList = formatConceptList(quotedTitles);
  const main = `Für "${query}" liefern ${conceptList} Orientierung beim weiteren Vorgehen.`;

  const rationaleSegments =
    finalContextElements.length > 0
      ? finalContextElements.map(
          (element, index) =>
            `${index + 1}) ${element.title}: ${element.summary}`,
        )
      : finalReferences.map((reference, index) => `${index + 1}) ${reference.title}`);

  const { expectedReferenceIds, matchedCount } = evaluateExpectationMatch(
    query,
    finalReferences.map((reference) => reference.nodeId),
  );
  const expectationFallback = buildExpectationFallbackHint(query, matchedCount, expectedReferenceIds);
  const coreRationale = expectationFallback
    ? `${rationaleSegments.join(" ")} ${expectationFallback}`
    : rationaleSegments.join(" ");

  const contextTokens = finalContextElements.reduce(
    (sum, element) => sum + estimateTokensFromText(element.title) + estimateTokensFromText(element.summary),
    0,
  );

  return {
    answer: {
      main,
      coreRationale,
    },
    references: finalReferences,
    contextElements: finalContextElements,
    contextTokens,
  };
}
