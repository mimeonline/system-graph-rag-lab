import type { QueryViewModel } from "@/features/query/view-model";

export type HomeGraphNodeKind = "query" | "reference" | "evidence";

export type HomeGraphNode = {
  id: string;
  label: string;
  compactLabel?: string;
  shortDescription?: string;
  longDescription?: string;
  url?: string;
  kind: HomeGraphNodeKind;
  nodeType?: string;
  x: number;
  y: number;
};

export type HomeGraphEdge = {
  id: string;
  source: string;
  target: string;
  label: string;
};

export type HomeGraphModel = {
  nodes: HomeGraphNode[];
  edges: HomeGraphEdge[];
  isFallback: boolean;
  caption: string;
};

const FALLBACK_QUERY = "Beispielfrage";
const FALLBACK_QUERY_EN = "Sample question";

const REFERENCE_LAYOUT_BY_COUNT: Record<number, Array<{ x: number; y: number }>> = {
  1: [{ x: 50, y: 50 }],
  2: [
    { x: 26, y: 52 },
    { x: 74, y: 52 },
  ],
  3: [
    { x: 28, y: 52 },
    { x: 50, y: 60 },
    { x: 72, y: 52 },
  ],
};

/**
 * Builds a lightweight graph model for the home page.
 */
export function buildHomeGraphModel(
  viewModel: QueryViewModel | null,
  currentQuery: string,
  locale: "de" | "en",
): HomeGraphModel {
  const isEn = locale === "en";
  const references = viewModel?.references ?? [];
  const derivationDetails = viewModel?.derivationDetails ?? [];
  const contextElements = viewModel?.contextElements ?? [];
  const contextByNodeId = new Map(contextElements.map((element) => [element.nodeId, element]));
  const cleanedQuery = currentQuery.trim();

  if (references.length === 0) {
    return {
      isFallback: true,
      caption: isEn
        ? "Learning view: this is how a traceable answer emerges from question, concept, and evidence."
        : "Lernansicht: So entsteht aus Frage, Konzept und Beleg eine nachvollziehbare Antwort.",
      nodes: [
        {
          id: "query-fallback",
          label: cleanedQuery.length > 0 ? cleanedQuery : isEn ? "Question" : "Frage",
          compactLabel: isEn ? "Question" : "Frage",
          shortDescription: isEn ? "Starting question for the analysis." : "Ausgangsfrage für die Analyse.",
          longDescription: isEn ? "Starting question for the analysis." : "Ausgangsfrage für die Analyse.",
          kind: "query",
          nodeType: "Query",
          x: 50,
          y: 20,
        },
        {
          id: "top-concept-fallback",
          label: isEn ? "Top concept" : "Top-Konzept",
          compactLabel: isEn ? "Concept" : "Konzept",
          shortDescription: isEn
            ? "Relevant concept for framing the question."
            : "Relevantes Konzept zur Einordnung der Frage.",
          longDescription: isEn
            ? "Relevant concept for framing the question."
            : "Relevantes Konzept zur Einordnung der Frage.",
          kind: "reference",
          nodeType: "Concept",
          x: 24,
          y: 56,
        },
        {
          id: "evidence-fallback",
          label: isEn ? "Evidence" : "Beleg",
          compactLabel: isEn ? "Evidence" : "Beleg",
          shortDescription: isEn ? "Source or fact supporting the answer." : "Quelle oder Fakt zur Begründung.",
          longDescription: isEn ? "Source or fact supporting the answer." : "Quelle oder Fakt zur Begründung.",
          kind: "evidence",
          nodeType: "Evidence",
          x: 58,
          y: 70,
        },
        {
          id: "answer-fallback",
          label: isEn ? "Answer" : "Antwort",
          compactLabel: isEn ? "Answer" : "Antwort",
          shortDescription: isEn
            ? "Derived answer based on concept and evidence."
            : "Abgeleitete Antwort aus Konzept und Beleg.",
          longDescription: isEn
            ? "Derived answer based on concept and evidence."
            : "Abgeleitete Antwort aus Konzept und Beleg.",
          kind: "reference",
          nodeType: "Answer",
          x: 78,
          y: 88,
        },
      ],
      edges: [
        {
          id: "fallback-step-1",
          source: "query-fallback",
          target: "top-concept-fallback",
          label: isEn ? "1 Clarify" : "1 Klären",
        },
        {
          id: "fallback-step-2",
          source: "top-concept-fallback",
          target: "evidence-fallback",
          label: isEn ? "2 Verify" : "2 Prüfen",
        },
        {
          id: "fallback-step-3",
          source: "evidence-fallback",
          target: "answer-fallback",
          label: isEn ? "3 Derive" : "3 Ableiten",
        },
      ],
    };
  }

  const limitedReferences = references.slice(0, 3);
  const referenceLayout = REFERENCE_LAYOUT_BY_COUNT[limitedReferences.length] ?? REFERENCE_LAYOUT_BY_COUNT[3];
  const referenceNodes: HomeGraphNode[] = limitedReferences.map((reference, index) => {
    const fallbackPosition = referenceLayout[Math.min(index, referenceLayout.length - 1)];
    const referenceTypeLabel = toReferenceTypeLabel(reference.nodeType);
    const typedLabel = `${referenceTypeLabel}: ${reference.title}`;
    const context = contextByNodeId.get(reference.nodeId);

    return {
      id: reference.nodeId,
      label: typedLabel,
      compactLabel: toCompactLabel(reference.title),
      shortDescription: context?.summary,
      longDescription: context?.longDescription ?? context?.summary,
      url: context?.source.publicReference.url ?? reference.explanationUrl,
      kind: "reference",
      nodeType: reference.nodeType,
      x: fallbackPosition.x,
      y: fallbackPosition.y,
    };
  });

  const queryNode: HomeGraphNode = {
    id: "query",
    label: viewModel?.query ?? (cleanedQuery.length > 0 ? cleanedQuery : isEn ? FALLBACK_QUERY_EN : FALLBACK_QUERY),
    compactLabel: isEn ? "Question" : "Frage",
    shortDescription: isEn ? "Current user question as the starting point." : "Aktuelle Nutzerfrage als Ausgangspunkt.",
    longDescription: isEn ? "Current user question as the starting point." : "Aktuelle Nutzerfrage als Ausgangspunkt.",
    kind: "query",
    nodeType: "Query",
    x: 50,
    y: 20,
  };

  const evidenceNodes: HomeGraphNode[] = derivationDetails
    .slice(0, Math.min(3, referenceNodes.length))
    .map((detail, index) => ({
    id: `evidence-${detail.nodeId}`,
    label: detail.label,
    compactLabel: toCompactLabel(detail.label),
    shortDescription: contextByNodeId.get(detail.nodeId)?.summary ?? detail.summary,
    longDescription: detail.summary,
    url: detail.sourceUrl,
    kind: "evidence",
    nodeType: "Evidence",
    x: derivationDetails.length === 1 ? 50 : 24 + index * 26,
    y: 88,
  }));

  const queryEdges: HomeGraphEdge[] = referenceNodes.map((node) => ({
    id: `query-${node.id}`,
    source: queryNode.id,
    target: node.id,
    label: isEn ? "1 Relevance" : "1 Relevanz",
  }));

  const evidenceEdges: HomeGraphEdge[] =
    evidenceNodes.length > 0
      ? evidenceNodes.map((node, index) => ({
          id: `evidence-link-${node.id}`,
          source: referenceNodes[index % referenceNodes.length].id,
          target: node.id,
          label: isEn ? `2 Evidence ${index + 1}` : `2 Beleg ${index + 1}`,
        }))
      : [
          {
            id: "core-rationale-link",
            source: referenceNodes[0].id,
            target: referenceNodes[referenceNodes.length - 1].id,
            label: isEn ? "2 Ground" : "2 Begründen",
          },
        ];

  const answerNode: HomeGraphNode = {
    id: "answer",
    label: isEn ? "Answer" : "Antwort",
    compactLabel: isEn ? "Answer" : "Antwort",
    shortDescription: isEn
      ? "Derived answer based on the relevant concepts and evidence."
      : "Abgeleitete Antwort auf Basis der relevanten Konzepte und Belege.",
    longDescription:
      viewModel?.answer.main ??
      (isEn
        ? "Derived answer based on the relevant concepts and evidence."
        : "Abgeleitete Antwort auf Basis der relevanten Konzepte und Belege."),
    kind: "reference",
    nodeType: "Answer",
    x: 50,
    y: 96,
  };
  const answerEdgesFromEvidence: HomeGraphEdge[] =
    evidenceNodes.length > 0
      ? evidenceNodes.map((node, index) => ({
          id: `answer-link-${node.id}`,
          source: node.id,
          target: answerNode.id,
          label: isEn ? `3 Derive ${index + 1}` : `3 Ableiten ${index + 1}`,
        }))
      : [];
  const referencedIdsWithEvidence = new Set(
    evidenceEdges.map((edge) => edge.source),
  );
  const answerEdgesFromUnpairedReferences: HomeGraphEdge[] = referenceNodes
    .filter((referenceNode) => !referencedIdsWithEvidence.has(referenceNode.id))
    .map((referenceNode, index) => ({
      id: `answer-link-direct-${referenceNode.id}`,
      source: referenceNode.id,
      target: answerNode.id,
      label: isEn ? `3 Derive direct ${index + 1}` : `3 Ableiten direkt ${index + 1}`,
    }));
  const answerEdges: HomeGraphEdge[] =
    answerEdgesFromEvidence.length > 0 || answerEdgesFromUnpairedReferences.length > 0
      ? [...answerEdgesFromEvidence, ...answerEdgesFromUnpairedReferences]
      : [
          {
            id: "answer-link-fallback",
            source: referenceNodes[referenceNodes.length - 1].id,
            target: answerNode.id,
            label: isEn ? "3 Derive" : "3 Ableiten",
          },
        ];

  return {
    nodes: [queryNode, ...referenceNodes, ...evidenceNodes, answerNode],
    edges: [...queryEdges, ...evidenceEdges, ...answerEdges],
    isFallback: false,
    caption: isEn
      ? `Current question: ${limitedReferences.length} relevant concepts support the answer rationale.`
      : `Aktuelle Frage: ${limitedReferences.length} relevante Konzepte führen zur Antwortbegründung.`,
  };
}

function toCompactLabel(label: string): string {
  const compact = label.replace(/\s+/g, " ").trim();
  if (compact.length <= 20) {
    return compact;
  }

  const twoWords = compact.split(" ").slice(0, 2).join(" ");
  if (twoWords.length <= 20) {
    return twoWords;
  }

  return `${compact.slice(0, 17)}...`;
}

function toReferenceTypeLabel(nodeType: string): string {
  switch (nodeType) {
    case "Book":
      return "Buch";
    case "Tool":
      return "Tool";
    case "Problem":
      return "Problem";
    case "Author":
      return "Autor";
    default:
      return "Konzept";
  }
}
