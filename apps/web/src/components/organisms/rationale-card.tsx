type RationaleCardProps = {
  coreRationale: string;
};

/**
 * Compact rationale card that surfaces the primary proof line.
 */
export function RationaleCard({ coreRationale }: RationaleCardProps): React.JSX.Element {
  const { rationaleIntro, evidenceItems } = splitRationale(coreRationale);

  return (
    <section className="order-4 space-y-3 rounded-xl border border-slate-200 bg-white p-4 sm:p-5 lg:order-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
          Warum diese Antwort stimmt
        </h3>
        <span className="text-xs font-semibold text-slate-500">Begründung mit Faktenbasis</span>
      </div>

      {rationaleIntro && <p className="text-sm leading-6 text-slate-700">{rationaleIntro}</p>}

      {evidenceItems.length > 0 && (
        <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Faktenbasis</p>
          <ol className="space-y-1.5">
            {evidenceItems.map((item) => (
              <li key={item} className="text-sm leading-6 text-slate-700">
                {item}
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}

function splitRationale(coreRationale: string): { rationaleIntro: string; evidenceItems: string[] } {
  const compact = coreRationale.replace(/\s+/g, " ").trim();
  if (!compact) {
    return { rationaleIntro: "", evidenceItems: [] };
  }

  const marker = "Nachvollziehbare Faktenbasis:";
  const markerIndex = compact.indexOf(marker);
  if (markerIndex === -1) {
    return { rationaleIntro: compact, evidenceItems: [] };
  }

  const intro = compact.slice(0, markerIndex).trim();
  const evidencePart = compact.slice(markerIndex + marker.length).trim();
  const evidenceItems = evidencePart
    .split(/\s(?=\d+\)\s)/g)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

  return {
    rationaleIntro: intro,
    evidenceItems,
  };
}
