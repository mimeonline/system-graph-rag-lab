import { describe, expect, it } from "vitest";
import { buildStructuredAnswer, MAX_REFERENCES_IN_RESPONSE } from "@/features/query/answer";
import type { QueryReference } from "@/features/query/contracts";
import type { SeedSourceType } from "@/features/seed-data/seed-data";
import { EXPECTATION_FALLBACK_PREFIX } from "@/features/query/reference-expectations";

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
    expect(result.answer.main).toContain("keine verlässliche Antwort");
    expect(result.answer.coreRationale).toContain("Frage etwas konkreter");
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
    expect(result.answer.main).toContain("Kurzantwort zu \"Testfrage\"");
    expect(result.answer.coreRationale).toContain("1)");
    expect(result.answer.coreRationale).toContain(finalContextElements[0].summary);
    expect(result.contextTokens).toBe(computeExpectedContextTokens(finalContextElements));
  });

  it("erzeugt keinen Fallback-Hinweis, wenn zwei erwartete Referenzen unter den ersten drei verbleiben", () => {
    const query = "Wie wirken Feedback Loops auf lokale Optimierung in komplexen Systemen?";
    const references: QueryReference[] = [
      {
        nodeId: "concept:feedback_loops",
        nodeType: "Concept",
        title: "Feedback Loops",
        score: 1,
        hop: 0,
      },
      {
        nodeId: "problem:local_optimization",
        nodeType: "Problem",
        title: "Lokale Optimierung",
        score: 0.95,
        hop: 0,
      },
      {
        nodeId: "concept:leverage_points",
        nodeType: "Concept",
        title: "Leverage Points",
        score: 0.9,
        hop: 0,
      },
    ];
    const contextElements = references.map((reference) => createContextElement(reference));

    const result = buildStructuredAnswer({
      query,
      references,
      contextElements,
    });

    expect(result.references).toHaveLength(references.length);
    expect(result.answer.coreRationale).not.toContain(EXPECTATION_FALLBACK_PREFIX);
    expect(result.answer.coreRationale).toContain("1) Feedback Loops");
  });

  it("ergänzt einen klaren Hinweis, wenn weniger als zwei erwartete Referenzen vorhanden sind", () => {
    const query = "Wie wirken Feedback Loops auf lokale Optimierung in komplexen Systemen?";
    const references: QueryReference[] = [
      {
        nodeId: "concept:system_boundary",
        nodeType: "Concept",
        title: "Systemgrenze",
        score: 0.8,
        hop: 0,
      },
      {
        nodeId: "concept:system_behavior",
        nodeType: "Concept",
        title: "Systemverhalten",
        score: 0.75,
        hop: 0,
      },
      {
        nodeId: "concept:feedback_loops",
        nodeType: "Concept",
        title: "Feedback Loops",
        score: 0.7,
        hop: 0,
      },
    ];
    const contextElements = references.map((reference) => createContextElement(reference));

    const result = buildStructuredAnswer({
      query,
      references,
      contextElements,
    });

    expect(result.answer.coreRationale).toContain(EXPECTATION_FALLBACK_PREFIX);
    expect(result.answer.coreRationale).toContain("nur 1 der erwarteten Konzepte");
  });
});
