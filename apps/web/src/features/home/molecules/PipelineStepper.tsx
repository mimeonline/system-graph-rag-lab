import type { QueryPanelStatus } from "@/components/organisms/query-panel-status";

type PipelineStepperProps = {
  status: QueryPanelStatus;
};

type PipelineStep = {
  id: string;
  label: string;
  detail: string;
};

const STEPS: PipelineStep[] = [
  { id: "question", label: "Frage", detail: "Systemproblem formulieren" },
  { id: "retrieval", label: "Retrieval", detail: "Kontext priorisieren" },
  { id: "graph", label: "Graph-Kontext", detail: "Knoten verknüpfen" },
  { id: "synthesis", label: "Synthese", detail: "Antwort herleiten" },
  { id: "action", label: "Handlung", detail: "Nächste Schritte nutzen" },
];

function getActiveStep(status: QueryPanelStatus): number {
  if (status === "loading") {
    return 3;
  }

  if (status === "success") {
    return 5;
  }

  if (status === "empty" || status === "error") {
    return 2;
  }

  return 1;
}

/**
 * Visual learning pipeline that makes the GraphRAG processing path scannable.
 */
export function PipelineStepper({ status }: PipelineStepperProps): React.JSX.Element {
  const activeStep = getActiveStep(status);

  return (
    <section className="space-y-3 rounded-xl border border-sky-200/70 bg-gradient-to-br from-sky-50 to-indigo-50 p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-700">Guided Mode</h3>
        <p className="text-xs font-semibold text-slate-600">Lernpfad sichtbar</p>
      </div>
      <ol className="grid gap-2 sm:grid-cols-5">
        {STEPS.map((step, index) => {
          const number = index + 1;
          const isActive = number <= activeStep;

          return (
            <li
              key={step.id}
              className={`rounded-lg border px-3 py-2 transition-colors ${
                isActive
                  ? "border-sky-300 bg-white text-slate-900"
                  : "border-slate-200 bg-white/70 text-slate-500"
              }`}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em]">{`${number}. ${step.label}`}</p>
              <p className="mt-1 text-xs">{step.detail}</p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
