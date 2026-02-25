import type { QueryRequest } from "@/features/query/contracts";

type ParseSuccess = {
  ok: true;
  data: QueryRequest;
};

type ParseFailure = {
  ok: false;
  message: string;
};

export type ParseQueryRequestResult = ParseSuccess | ParseFailure;

/**
 * Zweck:
 * Validiert und normalisiert den eingehenden Query-Request gegen den API-Contract.
 *
 * Input:
 * - input: unbekannter Request-Body
 *
 * Output:
 * - ParseQueryRequestResult mit `ok=true` und normalisierten Daten
 *   oder `ok=false` mit validierbarer Fehlermeldung
 *
 * Fehlerfall:
 * - Kein Throw, alle Validierungsfehler werden als `{ ok: false, message }` zurueckgegeben
 *
 * Beispiel:
 * - parseQueryRequest({ query: "  Was ist ein Feedback Loop?  " })
 */
export function parseQueryRequest(input: unknown): ParseQueryRequestResult {
  if (!input || typeof input !== "object") {
    return { ok: false, message: "Request body muss ein Objekt sein." };
  }

  const payload = input as Record<string, unknown>;
  const query = payload.query;

  if (typeof query !== "string") {
    return { ok: false, message: "Feld query muss ein String sein." };
  }

  const normalizedQuery = query.trim();
  if (normalizedQuery.length < 5 || normalizedQuery.length > 500) {
    return {
      ok: false,
      message: "Query muss zwischen 5 und 500 Zeichen enthalten.",
    };
  }

  const clientRequestId = payload.clientRequestId;
  if (
    clientRequestId !== undefined &&
    (typeof clientRequestId !== "string" || clientRequestId.length > 64)
  ) {
    return {
      ok: false,
      message: "clientRequestId darf maximal 64 Zeichen enthalten.",
    };
  }

  return {
    ok: true,
    data: {
      query: normalizedQuery,
      clientRequestId: clientRequestId as string | undefined,
    },
  };
}
