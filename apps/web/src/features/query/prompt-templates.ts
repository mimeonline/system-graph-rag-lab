import type { QueryContextElement, QueryReference } from "@/features/query/contracts";

export type PromptMessage = {
  role: "system" | "user";
  content: string;
};

type QueryLocale = "de" | "en";

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
  locale: QueryLocale = "de",
): PromptMessage[] {
  const referenceList = formatReferenceList(references);
  const contextSummaries = formatContextSummaries(contextElements);

  const systemContent =
    locale === "en"
      ? "You are a system-thinking assistant. Answer clearly in plain English, but only on the basis of the provided context."
      : "Du bist ein System-Thinking-Assistent. Antworte klar in Alltagssprache, aber nur auf Basis des bereitgestellten Kontexts.";
  const userContent =
    locale === "en"
      ? [
          `Question: ${query}`,
          `References:\n${referenceList}`,
          `Context summaries:\n${contextSummaries}`,
          "Use **only** the references and context information above. Do not add external facts.",
          'Respond only with valid JSON containing the fields "main", "coreRationale", and "nextSteps".',
          '"main": 120-220 words, easy to understand, with 3 parts: situation, explanation of relations, concrete consequence in everyday work.',
          '"coreRationale": briefly explain traceability with references [1], [2], [3] to the sources listed above.',
          '"nextSteps": array with 2-4 concrete, actionable next steps.',
          "Important: The graph context may be written in German. Still answer in English.",
        ].join("\n\n")
      : [
          `Frage: ${query}`,
          `Referenzen:\n${referenceList}`,
          `Kontextzusammenfassungen:\n${contextSummaries}`,
          "Nutze **nur** die oben genannten Referenzen und Kontextinformationen und gib keine zusätzlichen externen Fakten an.",
          'Antworte ausschließlich mit validem JSON mit den Feldern "main", "coreRationale" und "nextSteps".',
          '"main": 120-220 Wörter, leicht verständlich, mit 3 Teilen: Lage, Erklärung der Zusammenhänge, konkrete Konsequenz im Alltag.',
          '"coreRationale": erkläre knapp die Nachvollziehbarkeit mit Verweisen [1], [2], [3] auf die obigen Referenzen.',
          '"nextSteps": Array mit 2-4 konkreten, umsetzbaren nächsten Schritten.',
        ].join("\n\n");

  return [
    { role: "system", content: systemContent },
    { role: "user", content: userContent },
  ];
}

export function buildLlmOnlyPromptMessages(query: string, locale: QueryLocale = "de"): PromptMessage[] {
  return [
    {
      role: "system",
      content:
        locale === "en"
          ? "You are a helpful assistant. Give a clear answer in plain English."
          : "Du bist ein hilfreicher Assistent. Gib eine verständliche Antwort in Alltagssprache.",
    },
    {
      role: "user",
      content:
        locale === "en"
          ? [
              `Question: ${query}`,
              "Respond only as JSON with the fields main, coreRationale, nextSteps.",
              "main: 120-220 words.",
              "coreRationale: short rationale without source references.",
              "nextSteps: 2-4 concrete steps.",
            ].join("\n\n")
          : [
              `Frage: ${query}`,
              "Antworte ausschließlich als JSON mit den Feldern main, coreRationale, nextSteps.",
              "main: 120-220 Wörter.",
              "coreRationale: kurze Begründung ohne Quellenverweise.",
              "nextSteps: 2-4 konkrete Schritte.",
            ].join("\n\n"),
    },
  ];
}
