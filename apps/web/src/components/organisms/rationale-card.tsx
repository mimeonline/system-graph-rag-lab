type RationaleCardProps = {
  coreRationale: string;
};

/**
 * Compact rationale card that surfaces the primary proof line.
 */
export function RationaleCard({ coreRationale }: RationaleCardProps): React.JSX.Element {
  return (
    <section className="order-4 space-y-3 rounded-xl border border-slate-200 bg-white p-4 sm:p-5 lg:order-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
          Knapper P0-Kernnachweis
        </h3>
        <span className="text-xs font-semibold text-slate-500">Kernbegründung</span>
      </div>
      <p className="text-sm leading-7 text-slate-700">{coreRationale}</p>
    </section>
  );
}
