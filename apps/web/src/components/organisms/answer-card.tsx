import { StatusBadge } from "@/components/atoms/status-badge";
import type { QueryPanelStatus } from "@/components/organisms/query-panel-status";
import { useTranslations } from "next-intl";

type AnswerCardProps = {
  query: string;
  answer: string;
  contextTokens: number;
  status: QueryPanelStatus;
};

type AnswerSection = {
  title: string;
  content: string;
};

/**
 * Primary answer surface with semantic status and context budget.
 */
export function AnswerCard({ query, answer, contextTokens, status }: AnswerCardProps): React.JSX.Element {
  const t = useTranslations("Query");
  const sections = toStructuredSections(answer, {
    summaryTitle: t("summaryTitle"),
    sectionOrder: [
      { label: "Lage:", title: t("sectionSituation") },
      { label: "Erklärung der Zusammenhänge:", title: t("sectionRelations") },
      { label: "Konkrete Konsequenz im Alltag:", title: t("sectionConsequence") },
      { label: "Situation:", title: t("sectionSituation") },
      { label: "Explanation of relations:", title: t("sectionRelations") },
      { label: "Practical consequence:", title: t("sectionConsequence") },
    ],
  });

  return (
    <section className="order-2 space-y-4 rounded-xl border border-slate-200/70 bg-white/60 p-4 sm:p-5 lg:order-1">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">{t("answerTitle")}</h3>
          <p className="text-xs text-slate-500">{t("currentQuestion")}: {query}</p>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="space-y-2">
        {sections.map((section) => (
          <article key={section.title} className="rounded-lg border border-slate-200/70 bg-slate-50/80 px-3 py-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">{section.title}</h4>
            <p className="mt-1 text-sm leading-6 text-slate-700">{section.content}</p>
          </article>
        ))}
      </div>

      <p className="text-xs text-slate-500">
        {t("contextBudget", { tokens: contextTokens })}
      </p>
    </section>
  );
}

function toStructuredSections(
  answer: string,
  copy: {
    summaryTitle: string;
    sectionOrder: Array<{ label: string; title: string }>;
  },
): AnswerSection[] {
  const compact = answer.replace(/\s+/g, " ").trim();

  if (compact.length === 0) {
    return [];
  }

  const canonicalSectionOrder = copy.sectionOrder.slice(0, 3);
  const hasStructuredLabels = canonicalSectionOrder.every((item) => compact.includes(item.label));
  if (!hasStructuredLabels) {
    return [{ title: copy.summaryTitle, content: compact }];
  }

  const sections: AnswerSection[] = [];
  for (let index = 0; index < canonicalSectionOrder.length; index += 1) {
    const current = canonicalSectionOrder[index]!;
    const next = canonicalSectionOrder[index + 1];
    const start = compact.indexOf(current.label);
    if (start === -1) {
      continue;
    }

    const contentStart = start + current.label.length;
    const contentEnd = next ? compact.indexOf(next.label, contentStart) : compact.length;
    const content = compact.slice(contentStart, contentEnd === -1 ? compact.length : contentEnd).trim();

    if (content.length > 0) {
      sections.push({ title: current.title, content });
    }
  }

  if (sections.length === 0) {
    return [{ title: copy.summaryTitle, content: compact }];
  }

  return sections;
}
