import type { QueryContextElement, QueryReference } from "@/features/query/contracts";

export type PromptMessage = {
  role: "system" | "user";
  content: string;
};

function formatReferenceList(references: QueryReference[]): string {
  if (references.length === 0) {
    return "Keine Referenzen verfügbar.";
  }

  return references
    .map((reference, index) => {
      const explanation = reference.explanationUrl ? `, URL: ${reference.explanationUrl}` : "";
      return `${index + 1}. ${reference.title} (${reference.nodeType}) | Quelle: ${reference.citation}${explanation}`;
    })
    .join("\n");
}

function formatContextSummaries(contextElements: QueryContextElement[]): string {
  if (contextElements.length === 0) {
    return "Keine Kontextzusammenfassungen verfügbar.";
  }

  return contextElements
    .map((element, index) => `${index + 1}. ${element.title}: ${element.longDescription ?? element.summary}`)
    .join("\n");
}

export function buildGraphRagPromptMessages(
  query: string,
  references: QueryReference[],
  contextElements: QueryContextElement[],
): PromptMessage[] {
  const referenceList = formatReferenceList(references);
  const contextSummaries = formatContextSummaries(contextElements);

  const systemContent =
    "Du bist ein System-Thinking-Assistent. Antworte klar in Alltagssprache, aber nur auf Basis des bereitgestellten Kontexts.";
  const userContent = [
    `Frage: ${query}`,
    `Referenzen:\n${referenceList}`,
    `Kontextzusammenfassungen:\n${contextSummaries}`,
    "Nutze **nur** die oben genannten Referenzen und Kontextinformationen und gib keine zusätzlichen externen Fakten an.",
    "Antworte ausschließlich mit validem JSON mit den Feldern \"main\", \"coreRationale\" und \"nextSteps\".",
    "\"main\": 120-220 Wörter, leicht verständlich, mit 3 Teilen: Lage, Erklärung der Zusammenhänge, konkrete Konsequenz im Alltag.",
    "\"coreRationale\": erkläre knapp die Nachvollziehbarkeit mit Verweisen [1], [2], [3] auf die obigen Referenzen.",
    "\"nextSteps\": Array mit 2-4 konkreten, umsetzbaren nächsten Schritten.",
  ].join("\n\n");

  return [
    { role: "system", content: systemContent },
    { role: "user", content: userContent },
  ];
}

export function buildLlmOnlyPromptMessages(query: string): PromptMessage[] {
  return [
    {
      role: "system",
      content: "Du bist ein hilfreicher Assistent. Gib eine verständliche Antwort in Alltagssprache.",
    },
    {
      role: "user",
      content: [
        `Frage: ${query}`,
        "Antworte ausschließlich als JSON mit den Feldern main, coreRationale, nextSteps.",
        "main: 120-220 Wörter.",
        "coreRationale: kurze Begründung ohne Quellenverweise.",
        "nextSteps: 2-4 konkrete Schritte.",
      ].join("\n\n"),
    },
  ];
}
