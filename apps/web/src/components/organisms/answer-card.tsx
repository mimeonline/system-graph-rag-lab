import { StatusBadge } from "@/components/atoms/status-badge";
import type { QueryPanelStatus } from "@/components/organisms/query-panel-status";

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

const ANSWER_SECTION_ORDER: Array<{ label: string; title: string }> = [
  { label: "Lage:", title: "Lage" },
  { label: "Erklärung der Zusammenhänge:", title: "Zusammenhänge" },
  { label: "Konkrete Konsequenz im Alltag:", title: "Konsequenz" },
];

/**
 * Primary answer surface with semantic status and context budget.
 */
export function AnswerCard({ query, answer, contextTokens, status }: AnswerCardProps): React.JSX.Element {
  const sections = toStructuredSections(answer);

  return (
    <section className="order-2 space-y-3 rounded-xl border border-slate-200 bg-white p-4 sm:p-5 lg:order-1">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">Antwort</h3>
          <p className="text-xs text-slate-500">Aktuelle Frage: {query}</p>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="space-y-2">
        {sections.map((section) => (
          <article key={section.title} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">{section.title}</h4>
            <p className="mt-1 text-sm leading-6 text-slate-700">{section.content}</p>
          </article>
        ))}
      </div>

      <p className="text-xs text-slate-500">
        Kontextbudget: {contextTokens} Token (Schätzung der verwendeten Kontexte).
      </p>
    </section>
  );
}

function toStructuredSections(answer: string): AnswerSection[] {
  const compact = answer.replace(/\s+/g, " ").trim();

  if (compact.length === 0) {
    return [];
  }

  const hasStructuredLabels = ANSWER_SECTION_ORDER.every((item) => compact.includes(item.label));
  if (!hasStructuredLabels) {
    return [{ title: "Kurzantwort", content: compact }];
  }

  const sections: AnswerSection[] = [];
  for (let index = 0; index < ANSWER_SECTION_ORDER.length; index += 1) {
    const current = ANSWER_SECTION_ORDER[index]!;
    const next = ANSWER_SECTION_ORDER[index + 1];
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
    return [{ title: "Kurzantwort", content: compact }];
  }

  return sections;
}
