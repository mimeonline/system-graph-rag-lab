import { describe, expect, it } from "vitest";

import type {
  QueryContextElement,
  QueryReference,
  QuerySuccessResponse,
} from "@/features/query/contracts";
import { buildQueryViewModel } from "@/features/query/view-model";

const TEST_PUBLIC_REFERENCE = {
  kind: "book" as const,
  citation: "Test Citation",
};

function createReference(index: number): QueryReference {
  return {
    nodeId: `concept:test-${index}`,
    nodeType: "Concept",
    title: `Konzept ${index + 1}`,
    score: 1 - index * 0.01,
    hop: 0,
    citation: "Test Citation",
    explanationUrl: `https://example.org/concept-${index + 1}`,
    toolLinks: [
      {
        label: `Tool Link ${index + 1}`,
        url: `https://example.org/tool-${index + 1}`,
      },
    ],
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
      nextSteps: ["Schritt 1", "Schritt 2"],
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
    expect(viewModel.answer.main).toContain("Basisantwort");
    expect(viewModel.answer.coreRationale).toContain("Basisrationale");
    expect(viewModel.nextSteps).toEqual(["Schritt 1", "Schritt 2"]);
    expect(viewModel.references).toHaveLength(1);
  });

  it("maps references and derivation details from API response", () => {
    const references = Array.from({ length: 5 }, (_, index) => createReference(index));
    const contextElements = references.map(createContextElement);
    const response = createSuccessResponse({
      references,
      contextElements,
    });

    const viewModel = buildQueryViewModel(response, "Kernfrage");

    expect(viewModel.references).toHaveLength(5);
    expect(viewModel.contextElements).toHaveLength(5);
    expect(viewModel.references[0].tools[0]?.label).toContain("Tool Link 1");
    expect(viewModel.derivationDetails).toHaveLength(5);
    expect(viewModel.derivationDetails[0].label).toBe("1) Konzept 1");
    expect(viewModel.derivationDetails[0].summary).toBe(contextElements[0].summary);
    expect(viewModel.derivationDetails[0].sourceLabel).toBe("Test Citation");
    expect(viewModel.derivationDetails[0].sourceUrl).toBeUndefined();
  });

  it("maps empty states without injecting synthetic next steps", () => {
    const response = createSuccessResponse({
      references: [],
      contextElements: [],
    });

    const viewModel = buildQueryViewModel(response, "Fallback-Frage");

    expect(viewModel.references).toHaveLength(0);
    expect(viewModel.answer.main).toContain("Basisantwort");
    expect(viewModel.answer.coreRationale).toContain("Basisrationale");
    expect(viewModel.derivationDetails).toHaveLength(0);
    expect(viewModel.nextSteps).toEqual(["Schritt 1", "Schritt 2"]);
  });

  it("keeps API provided links and citations", () => {
    const references: QueryReference[] = [
      {
        nodeId: "concept:system-thinking-tools",
        nodeType: "Concept",
        title: "System Thinking Tools",
        score: 1,
        hop: 0,
        citation: "System Thinking Tools Citation",
        explanationUrl: "https://example.org/system-thinking-tools",
        toolLinks: [{ label: "Tool: Causal Loop Diagram", url: "https://example.org/cld" }],
      },
      {
        nodeId: "concept:network-analysis",
        nodeType: "Concept",
        title: "Network Analysis",
        score: 0.95,
        hop: 0,
        citation: "Network Analysis Citation",
        explanationUrl: "https://example.org/network-analysis",
        toolLinks: [{ label: "Tool: Network Visualization", url: "https://example.org/network-vis" }],
      },
      {
        nodeId: "concept:stocks-and-flows",
        nodeType: "Concept",
        title: "Stocks and Flows",
        score: 0.9,
        hop: 0,
        citation: "Stocks and Flows Citation",
        explanationUrl: "https://example.org/stocks-and-flows",
        toolLinks: [{ label: "Tool: Stock and Flow Diagram", url: "https://example.org/sfd" }],
      },
    ];
    const response = createSuccessResponse({
      references,
      contextElements: references.map(createContextElement),
    });

    const viewModel = buildQueryViewModel(response, "Welche Tools helfen beim Modellieren?");

    expect(viewModel.references[0].tools[0]?.label).toContain("Causal Loop Diagram");
    expect(viewModel.references[0].tools[0]?.url).toContain("/cld");
    expect(viewModel.references[0].explanationUrl).toBeTruthy();
    expect(viewModel.references[0].citation).toContain("System Thinking Tools Citation");
  });
});
