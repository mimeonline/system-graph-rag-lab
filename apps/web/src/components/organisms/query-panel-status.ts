export type QueryPanelStatus = "idle" | "loading" | "success" | "error" | "empty";

export type QueryPanelStatusHint = {
  statusText: string;
  nextAction: string;
};

type QueryErrorCode =
  | "INVALID_REQUEST"
  | "RATE_LIMIT"
  | "LLM_UPSTREAM_ERROR"
  | "GRAPH_BACKEND_UNAVAILABLE"
  | "UPSTREAM_TIMEOUT"
  | "INTERNAL_ERROR";

type QueryErrorPayload = {
  status?: string;
  error?: {
    code?: QueryErrorCode;
    message?: string;
  };
};

export type QueryPanelErrorCopy = {
  fallback: string;
  graphUnavailable: string;
  rateLimit: string;
  llmUnavailable: string;
};

function parseQueryErrorPayload(rawText: string): QueryErrorPayload | null {
  try {
    const parsed = JSON.parse(rawText) as unknown;

    if (typeof parsed !== "object" || parsed === null) {
      return null;
    }

    return parsed as QueryErrorPayload;
  } catch {
    return null;
  }
}

export function getUserFacingQueryErrorMessage(
  rawText: string,
  copy: QueryPanelErrorCopy,
): string {
  const payload = parseQueryErrorPayload(rawText);
  const code = payload?.error?.code;

  if (code === "GRAPH_BACKEND_UNAVAILABLE") {
    return copy.graphUnavailable;
  }

  if (code === "RATE_LIMIT") {
    return copy.rateLimit;
  }

  if (code === "LLM_UPSTREAM_ERROR" || code === "UPSTREAM_TIMEOUT") {
    return copy.llmUnavailable;
  }

  if (rawText.trim().startsWith("{")) {
    return copy.fallback;
  }

  return rawText.trim() || copy.fallback;
}

/**
 * Returns user-facing status copy and optional error override for the query panel.
 */
export function getStatusHint(
  status: QueryPanelStatus,
  copy: Record<QueryPanelStatus, QueryPanelStatusHint>,
  errorMessage?: string | null,
): QueryPanelStatusHint {
  const hint = copy[status];

  if (status === "error" && errorMessage) {
    return {
      statusText: errorMessage,
      nextAction: hint.nextAction,
    };
  }

  return hint;
}
