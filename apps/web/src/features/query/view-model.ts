import type {
  QueryContextElement,
  QueryReference,
  QuerySuccessResponse,
} from "@/features/query/contracts";
import { buildStructuredAnswer } from "@/features/query/answer";

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
  sourceFile: string;
};

export type QueryReferenceView = QueryReference & {
  tools: string[];
};

const TOOL_HINTS_BY_KEYWORD: Array<{ keywords: string[]; tools: string[] }> = [
  {
    keywords: ["system thinking tools"],
    tools: [
      "Tool: Causal Loop Diagram",
      "Tool: Behavior Over Time Graph",
      "Tool: Iceberg Model",
    ],
  },
  {
    keywords: ["network analysis"],
    tools: [
      "Tool: Network Visualization",
      "Tool: Centrality Mapping",
      "Tool: Dependency Graph",
    ],
  },
  {
    keywords: ["stocks and flows", "stock and flow"],
    tools: [
      "Tool: Stock and Flow Diagram",
      "Tool: Inflow Outflow Balance",
      "Tool: Accumulation Curve",
    ],
  },
];

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
    references: structuredAnswer.references.map((reference) => ({
      ...reference,
      tools: buildToolsForReference(reference),
    })),
    contextElements: structuredAnswer.contextElements,
    contextTokens: structuredAnswer.contextTokens,
    derivationDetails: buildDerivationDetails(structuredAnswer.contextElements),
    nextSteps: buildNextSteps(structuredAnswer.references),
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

function buildToolsForReference(reference: QueryReference): string[] {
  const normalizedTitle = reference.title.toLowerCase();

  for (const mapping of TOOL_HINTS_BY_KEYWORD) {
    if (mapping.keywords.some((keyword) => normalizedTitle.includes(keyword))) {
      return mapping.tools;
    }
  }

  if (reference.nodeType === "Tool") {
    return [`Tool: ${reference.title}`];
  }

  return ["Tool: Causal Mapping Canvas"];
}

function buildNextSteps(references: QueryReference[]): string[] {
  if (references.length === 0) {
    return [
      "Frage enger formulieren und einen konkreten Zeitraum oder Kontext ergänzen.",
      "Eine zweite Frage mit Fokus auf Ursache-Wirkung stellen.",
    ];
  }

  return [
    `Wähle zuerst ${references[0].title} und prüfe dort die stärkste Ursache-Wirkung-Kette.`,
    "Übertrage die wichtigsten Punkte in ein Causal Loop Diagram für den Teamabgleich.",
    "Leite daraus eine kleine nächste Experimentmaßnahme für die Architekturentscheidung ab.",
  ];
}
