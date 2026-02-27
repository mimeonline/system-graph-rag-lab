import { describe, expect, it } from "vitest";

import type {
  QueryContextElement,
  QueryReference,
  QuerySuccessResponse,
} from "@/features/query/contracts";
import { buildQueryViewModel } from "@/features/query/view-model";

const TEST_PUBLIC_REFERENCE = {
  kind: "book",
  citation: "Test Citation",
};

function createReference(index: number): QueryReference {
  return {
    nodeId: `concept:test-${index}`,
    nodeType: "Concept",
    title: `Konzept ${index + 1}`,
    score: 1 - index * 0.01,
    hop: 0,
  };
}

function createContextElement(reference: QueryReference): QueryContextElement {
  return {
    nodeId: reference.nodeId,
    nodeType: reference.nodeType,
    title: reference.title,
    summary: `Zusammenfassung für ${reference.title}`,
    source: {
      kind: "candidate",
      candidateId: reference.nodeId,
      sourceFile: "Test.md",
      sourceType: "primary_md",
      publicReference: TEST_PUBLIC_REFERENCE,
    },
  };
}

function createSuccessResponse({
  references = [createReference(0)],
  contextElements,
}: {
  references?: QueryReference[];
  contextElements?: QueryContextElement[];
} = {}): QuerySuccessResponse {
  const finalReferences = references;
  const finalContextElements = contextElements ?? finalReferences.map(createContextElement);

  return {
    status: "ok",
    state: "answer",
    requestId: "req-test",
    answer: {
      main: "Basisantwort",
      coreRationale: "Basisrationale",
    },
    references: finalReferences,
    context: {
      elements: finalContextElements,
    },
    meta: {
      topK: 6,
      hopDepth: 1,
      retrievedNodeCount: finalReferences.length,
      contextTokens: 0,
      latencyMs: 0,
      rateLimit: {
        limit: 10,
        windowSeconds: 60,
        remaining: 9,
      },
    },
  };
}

describe("buildQueryViewModel", () => {
  it("trimmed query text flows into the view model", () => {
    const response = createSuccessResponse();

    const viewModel = buildQueryViewModel(response, "  Testfrage  ");

    expect(viewModel.query).toBe("Testfrage");
    expect(viewModel.answer.main).toContain("Testfrage");
    expect(viewModel.references).toHaveLength(1);
  });

  it("limits Referenzen auf drei Einträge und bildet rationale Abschnitte", () => {
    const references = Array.from({ length: 5 }, (_, index) => createReference(index));
    const contextElements = references.map(createContextElement);
    const response = createSuccessResponse({
      references,
      contextElements,
    });

    const viewModel = buildQueryViewModel(response, "Kernfrage");

    expect(viewModel.references).toHaveLength(3);
    expect(viewModel.contextElements).toHaveLength(3);
    expect(viewModel.answer.coreRationale).toContain("1)");
    expect(viewModel.derivationDetails).toHaveLength(3);
    expect(viewModel.derivationDetails[0].label).toBe("1) Konzept 1");
    expect(viewModel.derivationDetails[0].summary).toBe(contextElements[0].summary);
    expect(viewModel.derivationDetails[0].sourceFile).toBe(contextElements[0].source.sourceFile);
    expect(viewModel.nextSteps.length).toBeGreaterThan(0);
  });

  it("setzt den Fallbacktext, wenn keine Referenzen vorliegen", () => {
    const response = createSuccessResponse({
      references: [],
      contextElements: [],
    });

    const viewModel = buildQueryViewModel(response, "Fallback-Frage");

    expect(viewModel.references).toHaveLength(0);
    expect(viewModel.answer.main).toContain("keine Antwort");
    expect(viewModel.answer.coreRationale).toContain("Bitte formuliere die Frage");
    expect(viewModel.derivationDetails).toHaveLength(0);
    expect(viewModel.nextSteps[0]).toContain("Frage enger formulieren");
  });

  it("zeigt konkrete Toolnamen bei groben Referenzlabels", () => {
    const references: QueryReference[] = [
      {
        nodeId: "concept:system-thinking-tools",
        nodeType: "Concept",
        title: "System Thinking Tools",
        score: 1,
        hop: 0,
      },
      {
        nodeId: "concept:network-analysis",
        nodeType: "Concept",
        title: "Network Analysis",
        score: 0.95,
        hop: 0,
      },
      {
        nodeId: "concept:stocks-and-flows",
        nodeType: "Concept",
        title: "Stocks and Flows",
        score: 0.9,
        hop: 0,
      },
    ];
    const response = createSuccessResponse({
      references,
      contextElements: references.map(createContextElement),
    });

    const viewModel = buildQueryViewModel(response, "Welche Tools helfen beim Modellieren?");

    expect(viewModel.references[0].tools).toContain("Tool: Causal Loop Diagram");
    expect(viewModel.references[1].tools).toContain("Tool: Network Visualization");
    expect(viewModel.references[2].tools).toContain("Tool: Stock and Flow Diagram");
  });
});
