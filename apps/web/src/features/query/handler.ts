import { randomUUID } from "node:crypto";
import {
  HOP_DEPTH,
  TOP_K,
  type QueryContextElement,
  type QueryErrorResponse,
  type QueryReference,
  type QuerySuccessResponse,
} from "@/features/query/contracts";
import { parseQueryRequest } from "@/features/query/schemas";
import { getQueryRuntimeEnv } from "@/lib/env";
import {
  buildContextCandidates,
  GraphBackendUnavailableError,
  type RetrievalResult,
} from "@/features/query/retrieval";
import { buildStructuredAnswer } from "@/features/query/answer";

type QueryHandlerResult = {
  status: number;
  body: QuerySuccessResponse | QueryErrorResponse;
  headers: Record<string, string>;
};

/**
 * Zweck:
 * Baut ein contract-konformes Fehlerobjekt fuer API-Antworten.
 *
 * Input:
 * - requestId, latencyMs, errorCode, message, retryable
 *
 * Output:
 * - QueryErrorResponse
 *
 * Fehlerfall:
 * - Kein Throw, rein deterministischer Mapper
 *
 * Beispiel:
 * - buildErrorResponse("req-1", 12, "INVALID_REQUEST", "query fehlt", false)
 */
function buildErrorResponse(
  requestId: string,
  latencyMs: number,
  code: QueryErrorResponse["error"]["code"],
  message: string,
  retryable: boolean,
): QueryErrorResponse {
  return {
    status: "error",
    requestId,
    error: {
      code,
      message,
      retryable,
    },
    meta: {
      latencyMs,
    },
  };
}

/**
 * Zweck:
 * Liefert eine minimale Success-Antwort im Bootstrap-Zustand ohne Retrieval-Treffer.
 *
 * Input:
 * - requestId, latencyMs sowie Rate-Limit-Parameter aus der Runtime-Konfiguration
 *
 * Output:
 * - QuerySuccessResponse mit `state: "empty"`
 *
 * Fehlerfall:
 * - Kein Throw, rein deterministischer Mapper
 *
 * Beispiel:
 * - buildEmptySuccessResponse("req-1", 20, 30, 60)
 */
function buildEmptySuccessResponse(
  requestId: string,
  latencyMs: number,
  rateLimitLimit: number,
  rateLimitWindowSeconds: number,
): QuerySuccessResponse {
  return {
    status: "ok",
    state: "empty",
    requestId,
    answer: {
      main: "Bootstrap-Skelett aktiv. Retrieval und LLM-Pipeline folgen in den Storys.",
      coreRationale:
        "Das API-Skelett erfüllt bereits Request-Validierung und Contract-konformes Response-Mapping.",
    },
    references: [],
    meta: {
      topK: TOP_K,
      hopDepth: HOP_DEPTH,
      retrievedNodeCount: 0,
      contextTokens: 0,
      latencyMs,
      rateLimit: {
        limit: rateLimitLimit,
        windowSeconds: rateLimitWindowSeconds,
        remaining: rateLimitLimit,
      },
    },
    context: {
      elements: [],
    },
  };
}

const OPENAI_CHAT_ENDPOINT = "https://api.openai.com/v1/chat/completions";

type OpenAiAnswer = {
  main: string;
  coreRationale: string;
};

class OpenAiUpstreamError extends Error {}

/**
 * Formats ranked references as numbered lines for the LLM prompt.
 */
function formatReferenceList(references: QueryReference[]): string {
  if (references.length === 0) {
    return "Keine Referenzen verfügbar.";
  }

  return references
    .map((reference, index) => {
      return `${index + 1}. ${reference.title} (${reference.nodeType})`;
    })
    .join("\n");
}

/**
 * Formats context summaries as numbered lines for the LLM prompt.
 */
function formatContextSummaries(contextElements: QueryContextElement[]): string {
  if (contextElements.length === 0) {
    return "Keine Kontextzusammenfassungen verfügbar.";
  }

  return contextElements
    .map((element, index) => `${index + 1}. ${element.title}: ${element.summary}`)
    .join("\n");
}

/**
 * Builds a minimal system and user message pair for OpenAI chat completion.
 */
function buildOpenAiMessages(
  query: string,
  references: QueryReference[],
  contextElements: QueryContextElement[],
): Array<{ role: "system" | "user"; content: string }> {
  const referenceList = formatReferenceList(references);
  const contextSummaries = formatContextSummaries(contextElements);

  const systemContent =
    "Du bist ein fokussierter System-Thinking-Assistent, der kurze, eindeutige Antworten auf Basis des bereitgestellten Kontextes liefert.";
  const userContent = [
    `Frage: ${query}`,
    `Referenzen:\n${referenceList}`,
    `Kontextzusammenfassungen:\n${contextSummaries}`,
    "Nutze **nur** die oben genannten Referenzen und Kontextinformationen und gib keine zusätzlichen externen Fakten an.",
    "Antworte ausschließlich mit validem JSON mit den Feldern \"main\" und \"coreRationale\"; beide Werte sind logische, zusammenhängende Texte, die auf den Referenzen basieren.",
  ].join("\n\n");

  return [
    { role: "system", content: systemContent },
    { role: "user", content: userContent },
  ];
}

/**
 * Tries to parse JSON directly or from the first balanced object-like slice.
 */
function tryParseJson(text: string): Record<string, unknown> | null {
  try {
    return JSON.parse(text);
  } catch {
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");
    if (firstBrace === -1 || lastBrace === -1 || firstBrace >= lastBrace) {
      return null;
    }

    const slice = text.slice(firstBrace, lastBrace + 1);
    try {
      return JSON.parse(slice);
    } catch {
      return null;
    }
  }
}

/**
 * Parses and validates OpenAI JSON content into the internal answer shape.
 */
function parseOpenAiJson(content: string): OpenAiAnswer {
  const trimmed = content.trim();
  const candidate = tryParseJson(trimmed);
  if (!candidate) {
    throw new OpenAiUpstreamError("OpenAI lieferte kein gültiges JSON im erwarteten Format.");
  }

  const main = candidate.main;
  const coreRationale = candidate.coreRationale;
  if (typeof main !== "string" || typeof coreRationale !== "string") {
    throw new OpenAiUpstreamError("OpenAI-Antwort enthält keine Strings für 'main' und 'coreRationale'.");
  }

  return {
    main: main.trim(),
    coreRationale: coreRationale.trim(),
  };
}

/**
 * Calls OpenAI chat completions and maps the assistant output to OpenAiAnswer.
 */
async function fetchOpenAiAnswer(options: {
  apiKey: string;
  model: string;
  query: string;
  references: QueryReference[];
  contextElements: QueryContextElement[];
}): Promise<OpenAiAnswer> {
  const { apiKey, model, query, references, contextElements } = options;

  const body = JSON.stringify({
    model,
    temperature: 0.2,
    max_tokens: 400,
    messages: buildOpenAiMessages(query, references, contextElements),
  });

  let response: Response;
  try {
    response = await fetch(OPENAI_CHAT_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body,
    });
  } catch (error) {
    throw new OpenAiUpstreamError(
      error instanceof Error ? error.message : "Fehler bei der Verbindung zur OpenAI API.",
    );
  }

  if (!response.ok) {
    throw new OpenAiUpstreamError(`OpenAI API antwortete mit Status ${response.status}.`);
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const assistantContent = payload.choices?.[0]?.message?.content;
  if (!assistantContent) {
    throw new OpenAiUpstreamError("OpenAI lieferte keine Assistant-Antwort.");
  }

  return parseOpenAiJson(assistantContent);
}

/**
 * Zweck:
 * Orchestriert den Query-Request-Endpunkt: Parsing, Env-Checks und Response-Mapping.
 *
 * Input:
 * - rawBody: unbekannter Request-Body
 *
 * Output:
 * - Promise<QueryHandlerResult> mit HTTP-Status, Body und Response-Headern
 *
 * Fehlerfall:
 * - Kein Throw nach aussen; fachliche Fehler werden als 4xx/5xx Result zurueckgegeben
 *
 * Beispiel:
 * - await handleQueryRequest({ query: "Was ist ein Hebelpunkt?" })
 */
export async function handleQueryRequest(rawBody: unknown): Promise<QueryHandlerResult> {
  const startedAt = Date.now();
  const requestId = randomUUID();
  const baseHeaders = {
    "Content-Type": "application/json; charset=utf-8",
    "X-Request-Id": requestId,
  };

  const parsed = parseQueryRequest(rawBody);
  if (!parsed.ok) {
    const latencyMs = Date.now() - startedAt;
    return {
      status: 400,
      headers: baseHeaders,
      body: buildErrorResponse(
        requestId,
        latencyMs,
        "INVALID_REQUEST",
        parsed.message,
        false,
      ),
    };
  }

  const env = getQueryRuntimeEnv();
  if (!env.openAiModel) {
    const latencyMs = Date.now() - startedAt;
    return {
      status: 500,
      headers: baseHeaders,
      body: buildErrorResponse(
        requestId,
        latencyMs,
        "INTERNAL_ERROR",
        "OPENAI_MODEL fehlt oder ist leer.",
        false,
      ),
    };
  }

  if (!env.openAiApiKey) {
    const latencyMs = Date.now() - startedAt;
    return {
      status: 500,
      headers: baseHeaders,
      body: buildErrorResponse(
        requestId,
        latencyMs,
        "INTERNAL_ERROR",
        "OPENAI_API_KEY fehlt oder ist leer.",
        false,
      ),
    };
  }

  let retrievalResult: RetrievalResult;
  try {
    retrievalResult = await buildContextCandidates(parsed.data.query, env);
  } catch (error) {
    if (error instanceof GraphBackendUnavailableError) {
      const latencyMs = Date.now() - startedAt;
      return {
        status: 503,
        headers: baseHeaders,
        body: buildErrorResponse(
          requestId,
          latencyMs,
          "GRAPH_BACKEND_UNAVAILABLE",
          "Der Graph-Backend-Service ist derzeit nicht erreichbar.",
          true,
        ),
      };
    }
    throw error;
  }
  const composedAnswer = buildStructuredAnswer({
    query: parsed.data.query,
    references: retrievalResult.references,
    contextElements: retrievalResult.contextElements,
  });

  let openAiAnswer: OpenAiAnswer;
  try {
    openAiAnswer = await fetchOpenAiAnswer({
      apiKey: env.openAiApiKey,
      model: env.openAiModel,
      query: parsed.data.query,
      references: composedAnswer.references,
      contextElements: composedAnswer.contextElements,
    });
  } catch (error) {
    const latencyMs = Date.now() - startedAt;
    const isOpenAiError = error instanceof OpenAiUpstreamError;
    return {
      status: isOpenAiError ? 502 : 500,
      headers: baseHeaders,
      body: buildErrorResponse(
        requestId,
        latencyMs,
        isOpenAiError ? "LLM_UPSTREAM_ERROR" : "INTERNAL_ERROR",
        error instanceof Error ? error.message : "Fehler bei der Antwortgenerierung.",
        isOpenAiError,
      ),
    };
  }

  const latencyMs = Date.now() - startedAt;
  const baseSuccess = buildEmptySuccessResponse(
    requestId,
    latencyMs,
    env.rateLimitMaxRequests,
    env.rateLimitWindowSeconds,
  );

  return {
    status: 200,
    headers: baseHeaders,
    body: {
      ...baseSuccess,
      state: composedAnswer.references.length === 0 ? "empty" : "answer",
      answer: openAiAnswer,
      references: composedAnswer.references,
      context: {
        elements: composedAnswer.contextElements,
      },
      meta: {
        ...baseSuccess.meta,
        retrievedNodeCount: composedAnswer.references.length,
        contextTokens: composedAnswer.contextTokens,
      },
    },
  };
}
