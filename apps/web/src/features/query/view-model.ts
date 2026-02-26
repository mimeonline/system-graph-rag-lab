import type {
  QueryContextElement,
  QueryReference,
  QuerySuccessResponse,
} from "@/features/query/contracts";
import { buildStructuredAnswer } from "@/features/query/answer";

export type QueryViewModel = {
  query: string;
  answer: QuerySuccessResponse["answer"];
  references: QueryReference[];
  contextElements: QueryContextElement[];
  contextTokens: number;
  derivationDetails: DerivationDetail[];
};

export type DerivationDetail = {
  nodeId: string;
  nodeType: QueryContextElement["nodeType"];
  label: string;
  summary: string;
  sourceFile: string;
};

/**
 * Builds the UI-facing query view model from API response and submitted query.
 */
export function buildQueryViewModel(
  response: QuerySuccessResponse,
  submittedQuery: string,
): QueryViewModel {
  const cleanedQuery = submittedQuery.trim();
  const effectiveQuery = cleanedQuery.length > 0 ? cleanedQuery : "Unbenannte Anfrage";

  const structuredAnswer = buildStructuredAnswer({
    query: effectiveQuery,
    references: response.references,
    contextElements: response.context.elements ?? [],
  });

  return {
    query: effectiveQuery,
    answer: structuredAnswer.answer,
    references: structuredAnswer.references,
    contextElements: structuredAnswer.contextElements,
    contextTokens: structuredAnswer.contextTokens,
    derivationDetails: buildDerivationDetails(structuredAnswer.contextElements),
  };
}

/**
 * Derives numbered context detail entries used by the derivation section.
 */
function buildDerivationDetails(elements: QueryContextElement[]): DerivationDetail[] {
  return elements.map((element, index) => ({
    nodeId: element.nodeId,
    nodeType: element.nodeType,
    label: `${index + 1}) ${element.title}`,
    summary: element.summary,
    sourceFile: element.source.sourceFile,
  }));
}
