"use client";

import { useEffect, useId, useState } from "react";
import { Maximize2, X } from "lucide-react";

import type { DemoGraphEdge, DemoGraphNode, DemoGraphTypeId } from "@/features/demo/graph-type-learning-model";
import { DemoGraphSimulationSvg } from "@/features/demo/molecules/DemoGraphSimulationSvg";

type DemoGraphSimulationPreviewProps = {
  graphType: {
    id: DemoGraphTypeId;
    title: string;
    nodes: DemoGraphNode[];
    edges: DemoGraphEdge[];
  };
  locale: "de" | "en";
};

export function DemoGraphSimulationPreview({
  graphType,
  locale,
}: DemoGraphSimulationPreviewProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const titleId = useId();
  const helperId = useId();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label={
          locale === "en"
            ? `Open ${graphType.title} simulation larger`
            : `${graphType.title}-Simulation größer öffnen`
        }
        onClick={() => setIsOpen(true)}
        className="group relative block w-full overflow-hidden rounded-3xl text-left outline-none ring-sky-500 transition focus-visible:ring-2"
      >
        <DemoGraphSimulationSvg graphType={graphType} />
        <span className="pointer-events-none absolute right-4 top-4 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/95 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-sky-700 opacity-0 shadow-sm transition group-hover:opacity-100 group-focus-visible:opacity-100">
          <Maximize2 className="h-3.5 w-3.5" aria-hidden />
          {locale === "en" ? "Open larger" : "Vergrößern"}
        </span>
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={helperId}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-3 backdrop-blur-sm sm:p-6"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-full max-w-6xl overflow-hidden rounded-3xl border border-white/15 bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 sm:px-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">Simulation</p>
                <h2 id={titleId} className="mt-1 text-xl font-bold text-slate-950 sm:text-2xl">
                  {graphType.title}
                </h2>
                <p id={helperId} className="mt-1 text-sm font-medium text-slate-600">
                  {locale === "en"
                    ? "Larger view of the graph flow and relation labels."
                    : "Größere Ansicht des Graph-Flows und der Relations-Texte."}
                </p>
              </div>
              <button
                type="button"
                aria-label={locale === "en" ? "Close simulation" : "Simulation schließen"}
                onClick={() => setIsOpen(false)}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-sky-300 hover:text-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>

            <div className="bg-slate-50 p-4 sm:p-6">
              <div className="mx-auto max-w-5xl">
                <DemoGraphSimulationSvg graphType={graphType} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
