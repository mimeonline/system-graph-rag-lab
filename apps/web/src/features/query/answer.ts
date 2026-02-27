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
  baseAnswer?: QuerySuccessResponse["answer"];
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
  baseAnswer,
}: BuildStructuredAnswerInput): BuildStructuredAnswerResult {
  const candidateReferences = references.slice(0, MAX_REFERENCES_IN_RESPONSE);
  const alignedCount = Math.min(candidateReferences.length, contextElements.length);
  const finalReferences = candidateReferences.slice(0, alignedCount);
  const finalContextElements = contextElements.slice(0, finalReferences.length);

  if (finalReferences.length === 0) {
    const fallbackMain = query
      ? `Auf "${query}" können wir gerade noch keine verlässliche Antwort geben.`
      : "Wir können gerade noch keine verlässliche Antwort geben.";
    const fallbackRationale =
      "Formuliere die Frage etwas konkreter. Hilfreich sind Team, Zeitraum oder ein konkreter Fall.";

    return {
      answer: {
        main: fallbackMain,
        coreRationale: fallbackRationale,
        nextSteps: [],
      },
      references: [],
      contextElements: [],
      contextTokens: 0,
    };
  }

  const quotedTitles = finalReferences.map((reference) => `«${reference.title}»`);
  const conceptList = formatConceptList(quotedTitles);
  const fallbackMain = `Kurzantwort zu "${query}": Diese Konzepte helfen dir am meisten weiter: ${conceptList}.`;

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
  const traceText = rationaleSegments.join(" ");
  const llmMain = sanitizeText(baseAnswer?.main);
  const llmRationale = sanitizeText(baseAnswer?.coreRationale);
  const nextSteps = Array.isArray(baseAnswer?.nextSteps)
    ? baseAnswer.nextSteps
        .filter((step): step is string => typeof step === "string")
        .map((step) => step.trim())
        .filter((step) => step.length > 0)
        .slice(0, 4)
    : [];
  const main = llmMain ?? fallbackMain;
  const coreRationaleBase = llmRationale ?? "Herleitung aus den ausgewählten Kontextstellen.";
  const expectationText = expectationFallback ? ` ${expectationFallback}` : "";
  const coreRationale = `${coreRationaleBase}\n\nNachvollziehbare Faktenbasis: ${traceText}${expectationText}`;

  const contextTokens = finalContextElements.reduce(
    (sum, element) => sum + estimateTokensFromText(element.title) + estimateTokensFromText(element.summary),
    0,
  );

  return {
    answer: {
      main,
      coreRationale,
      nextSteps,
    },
    references: finalReferences,
    contextElements: finalContextElements,
    contextTokens,
  };
}

function sanitizeText(value: string | undefined): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const cleaned = value.trim();
  return cleaned.length > 0 ? cleaned : null;
}
