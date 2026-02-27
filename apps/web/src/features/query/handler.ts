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

type OpenAiErrorDetails = {
  message?: string;
  code?: string;
  type?: string;
  param?: string;
};

type OpenAiMessageContentPart = {
  text?: unknown;
  type?: unknown;
};

type OpenAiChatPayload = {
  choices?: Array<{
    message?: {
      content?: unknown;
      refusal?: unknown;
    };
    text?: unknown;
  }>;
};

class OpenAiUpstreamError extends Error {
  public readonly retryable: boolean;

  constructor(message: string, public readonly status?: number, retryable?: boolean) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = "OpenAiUpstreamError";
    this.retryable =
      typeof retryable === "boolean"
        ? retryable
        : status === 429 || (status !== undefined && status >= 500);
  }
}

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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function sanitizeErrorText(text: string): string | null {
  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return null;
  }

  const singleLine = trimmed.replace(/\s+/g, " ");
  return singleLine.length <= 400 ? singleLine : `${singleLine.slice(0, 397)}...`;
}

function extractOpenAiErrorDetails(text: string): OpenAiErrorDetails | null {
  if (!text) {
    return null;
  }

  try {
    const parsed = JSON.parse(text);
    const candidate =
      typeof parsed === "object" && parsed !== null && "error" in parsed
        ? (parsed as { error: unknown }).error
        : parsed;

    if (typeof candidate !== "object" || candidate === null) {
      return null;
    }

    const details: OpenAiErrorDetails = {};
    if (typeof (candidate as { message?: unknown }).message === "string") {
      details.message = (candidate as { message?: string }).message.trim();
    }
    if (typeof (candidate as { code?: unknown }).code === "string") {
      details.code = (candidate as { code?: string }).code;
    }
    if (typeof (candidate as { type?: unknown }).type === "string") {
      details.type = (candidate as { type?: string }).type;
    }
    if (typeof (candidate as { param?: unknown }).param === "string") {
      details.param = (candidate as { param?: string }).param;
    }

    if (Object.keys(details).length === 0) {
      return null;
    }

    return details;
  } catch {
    return null;
  }
}

function buildOpenAiErrorMessage(
  status: number,
  rawBody: string,
  details?: OpenAiErrorDetails | null,
): string {
  const segments: string[] = [];

  if (details?.message) {
    segments.push(details.message);
  }
  if (details?.code) {
    segments.push(`code=${details.code}`);
  }
  if (details?.type) {
    segments.push(`type=${details.type}`);
  }
  if (details?.param) {
    segments.push(`param=${details.param}`);
  }

  if (!segments.length) {
    const sanitized = sanitizeErrorText(rawBody);
    if (sanitized) {
      segments.push(sanitized);
    } else {
      segments.push(`Status ${status} ohne zusätzliche Details.`);
    }
  }

  return `OpenAI API error ${status}: ${segments.join("; ")}`;
}

/**
 * Parses and validates OpenAI JSON content into the internal answer shape.
 */
function parseOpenAiJson(content: string): OpenAiAnswer {
  const trimmed = content.trim();
  const candidate = tryParseJson(trimmed);
  if (!candidate) {
    throw new OpenAiUpstreamError(
      "OpenAI lieferte kein gültiges JSON im erwarteten Format.",
      200,
      true,
    );
  }

  const main = candidate.main;
  const coreRationale = candidate.coreRationale;
  if (typeof main !== "string" || typeof coreRationale !== "string") {
    throw new OpenAiUpstreamError(
      "OpenAI-Antwort enthält keine Strings für 'main' und 'coreRationale'.",
      200,
      true,
    );
  }

  return {
    main: main.trim(),
    coreRationale: coreRationale.trim(),
  };
}

function extractAssistantContent(payload: OpenAiChatPayload): {
  content: string | null;
  refusal: string | null;
} {
  const choice = payload.choices?.[0];
  const message = choice?.message;

  const refusal =
    typeof message?.refusal === "string" && message.refusal.trim().length > 0
      ? message.refusal.trim()
      : null;

  const messageContent = message?.content;
  if (typeof messageContent === "string") {
    const trimmed = messageContent.trim();
    return {
      content: trimmed.length > 0 ? trimmed : null,
      refusal,
    };
  }

  if (Array.isArray(messageContent)) {
    const chunks = messageContent
      .map((part) => {
        if (!isRecord(part)) {
          return "";
        }

        const contentPart = part as OpenAiMessageContentPart;
        if (typeof contentPart.text === "string") {
          return contentPart.text;
        }

        return "";
      })
      .map((value) => value.trim())
      .filter((value) => value.length > 0);

    return {
      content: chunks.length > 0 ? chunks.join("\n") : null,
      refusal,
    };
  }

  if (typeof choice?.text === "string") {
    const trimmed = choice.text.trim();
    return {
      content: trimmed.length > 0 ? trimmed : null,
      refusal,
    };
  }

  return {
    content: null,
    refusal,
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

  const requestPayload = {
    model,
    max_completion_tokens: 400,
    messages: buildOpenAiMessages(query, references, contextElements),
  };

  let response: Response;
  try {
    response = await fetch(OPENAI_CHAT_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestPayload),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Fehler bei der Verbindung zur OpenAI API.";
    throw new OpenAiUpstreamError(`OpenAI API error: ${message}`, 0, true);
  }

  if (!response.ok) {
    const rawBody = await response.text();
    const details = extractOpenAiErrorDetails(rawBody);
    const composedMessage = buildOpenAiErrorMessage(response.status, rawBody, details);
    const retryable = response.status === 429 || response.status >= 500;
    throw new OpenAiUpstreamError(
      composedMessage,
      response.status,
      retryable,
    );
  }

  const payload = (await response.json()) as OpenAiChatPayload;
  const extracted = extractAssistantContent(payload);
  if (!extracted.content) {
    if (extracted.refusal) {
      throw new OpenAiUpstreamError(
        `OpenAI hat die Antwort verweigert: ${extracted.refusal}`,
        200,
        false,
      );
    }

    throw new OpenAiUpstreamError(
      "OpenAI lieferte keine Assistant-Antwort.",
      200,
      false,
    );
  }

  return parseOpenAiJson(extracted.content);
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
    const retryable = isOpenAiError ? error.retryable : false;
    const message =
      error instanceof Error ? error.message : "Fehler bei der Antwortgenerierung.";

    return {
      status: isOpenAiError ? 502 : 500,
      headers: baseHeaders,
      body: buildErrorResponse(
        requestId,
        latencyMs,
        isOpenAiError ? "LLM_UPSTREAM_ERROR" : "INTERNAL_ERROR",
        message,
        retryable,
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
