import { randomUUID } from "node:crypto";
import {
  HOP_DEPTH,
  TOP_K,
  type QueryErrorResponse,
  type QuerySuccessResponse,
} from "@/features/query/contracts";
import { parseQueryRequest } from "@/features/query/schemas";
import { getQueryRuntimeEnv } from "@/lib/env";
import { buildContextCandidates } from "@/features/query/retrieval";

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
  };
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

  const { references, contextTokens } = buildContextCandidates(parsed.data.query);
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
      state: references.length === 0 ? "empty" : "answer",
      references,
      meta: {
        ...baseSuccess.meta,
        retrievedNodeCount: references.length,
        contextTokens,
      },
    },
  };
}
