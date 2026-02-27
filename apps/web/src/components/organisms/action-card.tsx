type ActionCardProps = {
  steps: string[];
};

/**
 * Action-focused summary translating answer into immediate next steps.
 */
export function ActionCard({ steps }: ActionCardProps): React.JSX.Element {
  return (
    <section className="order-3 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5 lg:order-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
          Was bringt mir das jetzt?
        </h3>
        <span className="text-xs font-semibold text-slate-500">nächste Schritte</span>
      </div>
      <ul className="space-y-2">
        {steps.map((step) => (
          <li key={step} className="text-sm leading-6 text-slate-700">
            {step}
          </li>
        ))}
      </ul>
    </section>
  );
}
