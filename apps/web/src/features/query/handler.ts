import { randomUUID } from "node:crypto";
import {
  HOP_DEPTH,
  TOP_K,
  type QueryErrorResponse,
  type QuerySuccessResponse,
} from "@/features/query/contracts";
import { parseQueryRequest } from "@/features/query/schemas";
import { getQueryRuntimeEnv } from "@/lib/env";

type QueryHandlerResult = {
  status: number;
  body: QuerySuccessResponse | QueryErrorResponse;
  headers: Record<string, string>;
};

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

  const latencyMs = Date.now() - startedAt;
  return {
    status: 200,
    headers: baseHeaders,
    body: buildEmptySuccessResponse(
      requestId,
      latencyMs,
      env.rateLimitMaxRequests,
      env.rateLimitWindowSeconds,
    ),
  };
}
