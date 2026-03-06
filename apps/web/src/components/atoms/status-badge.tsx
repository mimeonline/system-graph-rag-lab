import type { QueryPanelStatus } from "@/components/organisms/query-panel-status";
import { useTranslations } from "next-intl";

type StatusBadgeProps = {
  status: QueryPanelStatus;
};

const STATUS_TONE: Record<QueryPanelStatus, string> = {
  idle: "border-slate-200 bg-white text-slate-700",
  loading: "border-sky-200 bg-white text-sky-800",
  success: "border-emerald-200 bg-white text-emerald-800",
  empty: "border-amber-200 bg-white text-amber-800",
  error: "border-rose-200 bg-white text-rose-800",
};

/**
 * Compact semantic status indicator used across query and learning workflow blocks.
 */
export function StatusBadge({ status }: StatusBadgeProps): React.JSX.Element {
  const t = useTranslations("Status");

  return (
    <span
      aria-live="polite"
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border px-2.5 py-1 text-xs font-semibold shadow-sm ${STATUS_TONE[status]}`}
    >
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {t(status)}
    </span>
  );
}
