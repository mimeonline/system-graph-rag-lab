import type { QueryViewModel } from "@/features/query/view-model";

export type HomeGraphNodeKind = "query" | "reference" | "evidence";

export type HomeGraphNode = {
  id: string;
  label: string;
  compactLabel?: string;
  kind: HomeGraphNodeKind;
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

const REFERENCE_LAYOUT_BY_COUNT: Record<number, Array<{ x: number; y: number }>> = {
  1: [{ x: 50, y: 54 }],
  2: [
    { x: 26, y: 56 },
    { x: 74, y: 56 },
  ],
  3: [
    { x: 18, y: 52 },
    { x: 50, y: 66 },
    { x: 82, y: 52 },
  ],
};

/**
 * Builds a lightweight graph model for the home page.
 */
export function buildHomeGraphModel(
  viewModel: QueryViewModel | null,
  currentQuery: string,
): HomeGraphModel {
  const references = viewModel?.references ?? [];
  const derivationDetails = viewModel?.derivationDetails ?? [];
  const cleanedQuery = currentQuery.trim();

  if (references.length === 0) {
    return {
      isFallback: true,
      caption: "Lernansicht: So entsteht aus Frage, Konzept und Beleg eine nachvollziehbare Antwort.",
      nodes: [
        {
          id: "query-fallback",
          label: cleanedQuery.length > 0 ? cleanedQuery : "Frage",
          compactLabel: "Frage",
          kind: "query",
          x: 50,
          y: 20,
        },
        {
          id: "top-concept-fallback",
          label: "Top-Konzept",
          compactLabel: "Konzept",
          kind: "reference",
          x: 21,
          y: 56,
        },
        {
          id: "evidence-fallback",
          label: "Beleg",
          compactLabel: "Beleg",
          kind: "evidence",
          x: 56,
          y: 56,
        },
        {
          id: "answer-fallback",
          label: "Antwort",
          compactLabel: "Antwort",
          kind: "reference",
          x: 78,
          y: 84,
        },
      ],
      edges: [
        {
          id: "fallback-step-1",
          source: "query-fallback",
          target: "top-concept-fallback",
          label: "1 Klären",
        },
        {
          id: "fallback-step-2",
          source: "top-concept-fallback",
          target: "evidence-fallback",
          label: "2 Prüfen",
        },
        {
          id: "fallback-step-3",
          source: "evidence-fallback",
          target: "answer-fallback",
          label: "3 Ableiten",
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

    return {
      id: reference.nodeId,
      label: typedLabel,
      compactLabel: toCompactLabel(typedLabel),
      kind: "reference",
      x: fallbackPosition.x,
      y: fallbackPosition.y,
    };
  });

  const queryNode: HomeGraphNode = {
    id: "query",
    label: viewModel?.query ?? (cleanedQuery.length > 0 ? cleanedQuery : FALLBACK_QUERY),
    compactLabel: "Frage",
    kind: "query",
    x: 50,
    y: 20,
  };

  const evidenceNodes: HomeGraphNode[] = derivationDetails.slice(0, 2).map((detail, index) => ({
    id: `evidence-${detail.nodeId}`,
    label: detail.label,
    compactLabel: toCompactLabel(detail.label),
    kind: "evidence",
    x: derivationDetails.length === 1 ? 50 : 35 + index * 30,
    y: 84,
  }));

  const queryEdges: HomeGraphEdge[] = referenceNodes.map((node) => ({
    id: `query-${node.id}`,
    source: queryNode.id,
    target: node.id,
    label: "1 Relevanz",
  }));

  const evidenceEdges: HomeGraphEdge[] =
    evidenceNodes.length > 0
      ? evidenceNodes.map((node, index) => ({
          id: `evidence-link-${node.id}`,
          source: referenceNodes[index % referenceNodes.length].id,
          target: node.id,
          label: `2 Beleg ${index + 1}`,
        }))
      : [
          {
            id: "core-rationale-link",
            source: referenceNodes[0].id,
            target: referenceNodes[referenceNodes.length - 1].id,
            label: "2 Begründen",
          },
        ];

  return {
    nodes: [queryNode, ...referenceNodes, ...evidenceNodes],
    edges: [...queryEdges, ...evidenceEdges],
    isFallback: false,
    caption: `Aktuelle Frage: ${limitedReferences.length} relevante Konzepte führen zur Antwortbegründung.`,
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
