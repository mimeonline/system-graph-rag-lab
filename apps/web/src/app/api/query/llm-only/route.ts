import { parseQueryRequest } from "@/features/query/schemas";
import { getQueryRuntimeEnv } from "@/lib/env";
import { buildLlmOnlyPromptMessages } from "@/features/query/prompt-templates";

const OPENAI_CHAT_ENDPOINT = "https://api.openai.com/v1/chat/completions";
const OPENAI_MAX_COMPLETION_TOKENS = 900;

type LlmOnlyResponse = {
  status: "ok";
  answer: {
    main: string;
    coreRationale: string;
    nextSteps: string[];
  };
  meta: {
    latencyMs: number;
    model: string;
  };
};

function tryParseJson(text: string): Record<string, unknown> | null {
  try {
    return JSON.parse(text);
  } catch {
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");
    if (firstBrace === -1 || lastBrace === -1 || firstBrace >= lastBrace) {
      return null;
    }
    try {
      return JSON.parse(text.slice(firstBrace, lastBrace + 1));
    } catch {
      return null;
    }
  }
}

function toSafeString(value: unknown, fallback: string): string {
  if (typeof value !== "string") {
    return fallback;
  }
  const cleaned = value.trim();
  return cleaned.length > 0 ? cleaned : fallback;
}

function toInlineText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function sanitizeStep(value: string): string {
  return value.replace(/^[\s\-*•\d.)]+/, "").replace(/\s+/g, " ").trim();
}

function extractNextStepsFromText(text: string): string[] {
  const candidates = text
    .split(/\n+|(?<=[.!?])\s+/)
    .map((part) => sanitizeStep(part))
    .filter((part) => part.length >= 24);

  return candidates.slice(0, 3);
}

function buildFallbackNextSteps(): string[] {
  return [
    "Formuliere die Frage präzise und benenne den konkreten Systemkontext.",
    "Prüfe zwei bis drei zentrale Annahmen mit nachvollziehbaren Belegen.",
    "Leite einen kleinen nächsten Schritt mit Verantwortlichkeit und Termin ab.",
  ];
}

export async function POST(request: Request): Promise<Response> {
  const startedAt = Date.now();
  const parsed = parseQueryRequest(await request.json().catch(() => null));
  if (!parsed.ok) {
    return new Response(JSON.stringify({ status: "error", message: parsed.message }), {
      status: 400,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }

  const env = getQueryRuntimeEnv();
  if (!env.openAiApiKey || !env.openAiModel) {
    return new Response(JSON.stringify({ status: "error", message: "OpenAI Konfiguration fehlt." }), {
      status: 500,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }

  const query = parsed.data.query.trim();
  const messages = buildLlmOnlyPromptMessages(query);

  const completionResponse = await fetch(OPENAI_CHAT_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.openAiApiKey}`,
    },
    body: JSON.stringify({
      model: env.openAiModel,
      response_format: { type: "json_object" },
      messages,
      max_completion_tokens: OPENAI_MAX_COMPLETION_TOKENS,
    }),
  });

  if (!completionResponse.ok) {
    const reason = (await completionResponse.text()).slice(0, 400);
    return new Response(JSON.stringify({ status: "error", message: reason || "LLM-only fehlgeschlagen." }), {
      status: 502,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }

  const payload = (await completionResponse.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = toInlineText(payload.choices?.[0]?.message?.content ?? "");
  const parsedJson = tryParseJson(content) ?? {};
  const rawMain =
    typeof parsedJson.main === "string" && parsedJson.main.trim().length > 0
      ? parsedJson.main.trim()
      : "";
  const fallbackMainFromContent =
    content.length > 0
      ? content
      : "LLM-only hat keine auswertbare Antwort geliefert. Bitte Anfrage erneut ausführen.";

  const parsedNextSteps = Array.isArray(parsedJson.nextSteps)
    ? parsedJson.nextSteps
        .filter((item): item is string => typeof item === "string")
        .map((item) => sanitizeStep(item))
        .filter((item) => item.length > 0)
    : [];
  const inferredNextSteps = extractNextStepsFromText(rawMain.length > 0 ? rawMain : fallbackMainFromContent);
  const resolvedNextSteps =
    parsedNextSteps.length > 0
      ? parsedNextSteps.slice(0, 3)
      : inferredNextSteps.length > 0
        ? inferredNextSteps
        : buildFallbackNextSteps();

  const body: LlmOnlyResponse = {
    status: "ok",
    answer: {
      main: rawMain.length > 0 ? rawMain : fallbackMainFromContent,
      coreRationale: toSafeString(
        parsedJson.coreRationale,
        "Kurzbegründung konnte nicht strukturiert extrahiert werden.",
      ),
      nextSteps: resolvedNextSteps,
    },
    meta: {
      latencyMs: Date.now() - startedAt,
      model: env.openAiModel,
    },
  };

  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
