import type { QueryPanelStatus } from "@/components/organisms/query-panel-status";

type StatusBadgeProps = {
  status: QueryPanelStatus;
};

const STATUS_LABELS: Record<QueryPanelStatus, string> = {
  idle: "Bereit",
  loading: "Analysiere Kontext",
  success: "Antwort erstellt",
  empty: "Kein passender Kontext",
  error: "Anfrage fehlgeschlagen",
};

const STATUS_TONE: Record<QueryPanelStatus, string> = {
  idle: "border-slate-300 bg-slate-50 text-slate-700",
  loading: "border-sky-300 bg-sky-50 text-sky-800",
  success: "border-emerald-300 bg-emerald-50 text-emerald-800",
  empty: "border-amber-300 bg-amber-50 text-amber-800",
  error: "border-rose-300 bg-rose-50 text-rose-800",
};

/**
 * Compact semantic status indicator used across query and learning workflow blocks.
 */
export function StatusBadge({ status }: StatusBadgeProps): React.JSX.Element {
  return (
    <span
      aria-live="polite"
      className={`rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_TONE[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
