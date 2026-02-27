import { StatusBadge } from "@/components/atoms/status-badge";
import type { QueryPanelStatus } from "@/components/organisms/query-panel-status";

type AnswerCardProps = {
  query: string;
  answer: string;
  contextTokens: number;
  status: QueryPanelStatus;
};

/**
 * Primary answer surface with semantic status and context budget.
 */
export function AnswerCard({ query, answer, contextTokens, status }: AnswerCardProps): React.JSX.Element {
  return (
    <section className="order-2 space-y-3 rounded-xl border border-slate-200 bg-white p-4 sm:p-5 lg:order-1">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">Antwort</h3>
          <p className="text-xs text-slate-500">Aktuelle Frage: {query}</p>
        </div>
        <StatusBadge status={status} />
      </div>
      <p className="text-sm leading-7 text-slate-700">{answer}</p>
      <p className="text-xs text-slate-500">
        Kontextbudget: {contextTokens} Token (Schätzung der verwendeten Kontexte).
      </p>
    </section>
  );
}
