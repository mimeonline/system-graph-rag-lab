import type {
  QueryContextElement,
  QueryReference,
  QuerySuccessResponse,
} from "@/features/query/contracts";

export type QueryViewModel = {
  query: string;
  answer: QuerySuccessResponse["answer"];
  references: QueryReferenceView[];
  contextElements: QueryContextElement[];
  contextTokens: number;
  derivationDetails: DerivationDetail[];
  nextSteps: string[];
};

export type DerivationDetail = {
  nodeId: string;
  nodeType: QueryContextElement["nodeType"];
  label: string;
  summary: string;
  sourceLabel: string;
  sourceUrl?: string;
};

export type QueryReferenceView = QueryReference & {
  tools: QuerySuccessResponse["references"][number]["toolLinks"];
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

  return {
    query: effectiveQuery,
    answer: response.answer,
    references: response.references.map((reference) => ({
      ...reference,
      tools: reference.toolLinks.map((tool) => ({
        ...tool,
        label: normalizeToolLabel(tool.label),
      })),
    })),
    contextElements: response.context.elements ?? [],
    contextTokens: response.meta.contextTokens,
    derivationDetails: buildDerivationDetails(response.context.elements ?? []),
    nextSteps: response.answer.nextSteps,
  };
}

function normalizeToolLabel(label: string): string {
  const trimmed = label.trim();
  if (trimmed.length === 0) {
    return trimmed;
  }

  const collapsed = trimmed.replace(/^\s*(tool\s*:\s*)+/i, "Tool: ");
  return collapsed;
}

/**
 * Derives numbered context detail entries used by the derivation section.
 */
function buildDerivationDetails(elements: QueryContextElement[]): DerivationDetail[] {
  return elements.map((element, index) => ({
    nodeId: element.nodeId,
    nodeType: element.nodeType,
    label: `${index + 1}) ${element.title}`,
    summary: element.longDescription ?? element.summary,
    sourceLabel: element.source.publicReference.citation,
    sourceUrl: element.source.publicReference.url,
  }));
}
