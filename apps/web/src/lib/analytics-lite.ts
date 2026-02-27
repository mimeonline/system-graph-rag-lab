export type AnalyticsLiteEvent = {
  event: string;
  payload?: Record<string, string | number | boolean>;
  timestamp: string;
};

const ANALYTICS_STORAGE_KEY = "system-graph-rag-analytics-lite-v1";

export function trackLiteEvent(event: string, payload?: Record<string, string | number | boolean>): void {
  if (typeof window === "undefined") {
    return;
  }

  const nextEvent: AnalyticsLiteEvent = {
    event,
    payload,
    timestamp: new Date().toISOString(),
  };

  try {
    const raw = window.localStorage.getItem(ANALYTICS_STORAGE_KEY);
    const current = raw ? (JSON.parse(raw) as AnalyticsLiteEvent[]) : [];
    const next = [nextEvent, ...current].slice(0, 100);
    window.localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Ignore storage restrictions in private mode etc.
  }

  if (process.env.NODE_ENV !== "production") {
    // Useful for quick local validation without full analytics stack.
    console.info("[analytics-lite]", nextEvent);
  }
}
