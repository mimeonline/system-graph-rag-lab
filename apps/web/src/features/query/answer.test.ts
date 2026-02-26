import { describe, expect, it } from "vitest";
import { buildStructuredAnswer, MAX_REFERENCES_IN_RESPONSE } from "@/features/query/answer";
import type { QueryReference } from "@/features/query/contracts";
import type { SeedSourceType } from "@/features/seed-data/seed-data";

const TEST_SOURCE_TYPE: SeedSourceType = "primary_md";

function createReference(index: number): QueryReference {
  return {
    nodeId: `concept:test-${index}`,
    nodeType: "Concept",
    title: `Konzept ${index + 1}`,
    score: 1 - index * 0.01,
    hop: 0,
  };
}

function createContextElement(reference: QueryReference) {
  return {
    nodeId: reference.nodeId,
    nodeType: reference.nodeType,
    title: reference.title,
    summary: `Kurzbeschreibung für ${reference.title}`,
    source: {
      kind: "candidate" as const,
      candidateId: reference.nodeId,
      sourceFile: "Test.md",
      sourceType: TEST_SOURCE_TYPE,
      publicReference: {
        kind: "book",
        citation: "Test Citation",
        isbn: "0000000000",
      },
    },
  };
}

function computeExpectedContextTokens(elements: { title: string; summary: string }[]) {
  return elements.reduce(
    (sum, element) =>
      sum +
      Math.ceil(element.title.length / 4) +
      Math.ceil(element.summary.length / 4),
    0,
  );
}

describe("buildStructuredAnswer", () => {
  it("returns a fallback message when kein Referenzkonzept verfügbar ist", () => {
    const result = buildStructuredAnswer({
      query: "Wie wirken Feedback-Loops zusammen?",
      references: [],
      contextElements: [],
    });

    expect(result.references).toHaveLength(0);
    expect(result.contextElements).toHaveLength(0);
    expect(result.answer.main).toContain("keine Antwort");
    expect(result.answer.coreRationale).toContain("Bitte formuliere die Frage");
    expect(result.contextTokens).toBe(0);
  });

  it("beschränkt Referenzen auf drei Einträge und bildet rationale Abschnitte", () => {
    const references = Array.from({ length: 5 }, (_, index) => createReference(index));
    const contextElements = references.map((reference) => createContextElement(reference));

    const result = buildStructuredAnswer({
      query: "Testfrage",
      references,
      contextElements,
    });

    const finalContextElements = contextElements.slice(0, MAX_REFERENCES_IN_RESPONSE);

    expect(result.references).toHaveLength(MAX_REFERENCES_IN_RESPONSE);
    expect(result.contextElements).toEqual(finalContextElements);
    expect(result.answer.main).toContain("Für \"Testfrage\"");
    expect(result.answer.coreRationale).toContain("1)");
    expect(result.answer.coreRationale).toContain(finalContextElements[0].summary);
    expect(result.contextTokens).toBe(computeExpectedContextTokens(finalContextElements));
  });
});
