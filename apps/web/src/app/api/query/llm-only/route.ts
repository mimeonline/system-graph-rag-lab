import { parseQueryRequest } from "@/features/query/schemas";
import { getQueryRuntimeEnv } from "@/lib/env";

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
  const messages = [
    {
      role: "system",
      content:
        "Du bist ein hilfreicher Assistent. Gib eine verständliche Antwort in Alltagssprache. Kein Graph- oder Quellenkontext verfügbar.",
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
  const content = payload.choices?.[0]?.message?.content ?? "";
  const parsedJson = tryParseJson(content) ?? {};

  const body: LlmOnlyResponse = {
    status: "ok",
    answer: {
      main: toSafeString(parsedJson.main, "Keine LLM-only Antwort verfügbar."),
      coreRationale: toSafeString(parsedJson.coreRationale, "Keine Begründung verfügbar."),
      nextSteps: Array.isArray(parsedJson.nextSteps)
        ? parsedJson.nextSteps.filter((item): item is string => typeof item === "string")
        : [],
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
