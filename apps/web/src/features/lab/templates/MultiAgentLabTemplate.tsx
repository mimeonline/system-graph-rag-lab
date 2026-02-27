import { SiteFooter } from "@/components/organisms/site-footer";
import { SiteHeader } from "@/components/organisms/site-header";
import { TrackedLink } from "@/components/molecules/tracked-link";
import { TrackedPageView } from "@/components/molecules/tracked-page-view";
import type { CaseStudyEntry, GitTimelineEvent } from "@/features/lab/contracts";

type MultiAgentLabTemplateProps = {
  events: GitTimelineEvent[];
  caseStudy: CaseStudyEntry[];
};

export function MultiAgentLabTemplate({ events, caseStudy }: MultiAgentLabTemplateProps): React.JSX.Element {
  return (
    <div className="flex min-h-screen flex-col bg-[#f4f8ff] text-slate-900">
      <TrackedPageView page="/lab/multi-agent" />
      <SiteHeader />
      <main className="flex-1 px-4 py-5 sm:px-6 sm:py-6">
        <div className="mx-auto w-full max-w-[1180px] space-y-6">
          <section className="space-y-3 pt-1">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-700">Multi-Agent Lab</p>
            <h1 className="text-[2rem] font-semibold tracking-tight text-slate-950">
              Zeitgeschichte aus echten Commits: Vom Multi-Agent-Experiment zum fokussierten Delivery-Flow
            </h1>
            <p className="max-w-[72ch] text-[0.96rem] leading-7 text-slate-700">
              Diese Seite basiert auf der tatsächlichen Git-Historie. Commits werden thematisch geclustert und zu einer
              nachvollziehbaren Entscheidungs-Timeline kuratiert.
            </p>
          </section>

          <section className="grid gap-4 lg:grid-cols-3">
            <article className="rounded-2xl border border-slate-200/70 bg-white/65 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Phasen</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">{events.length}</p>
              <p className="mt-1 text-sm text-slate-600">geclusterte Timeline-Abschnitte</p>
            </article>
            <article className="rounded-2xl border border-slate-200/70 bg-white/65 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Commits ausgewertet</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">{events.reduce((sum, event) => sum + event.commitCount, 0)}</p>
              <p className="mt-1 text-sm text-slate-600">für die Zeitgeschichte</p>
            </article>
            <article className="rounded-2xl border border-slate-200/70 bg-white/65 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Durchschnitt Impact</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">
                {Math.round(
                  events.reduce((sum, event) => sum + event.impactScore, 0) /
                    Math.max(events.length, 1),
                )}
              </p>
              <p className="mt-1 text-sm text-slate-600">interner Scoring-Indikator</p>
            </article>
          </section>

          <section className="rounded-2xl border border-slate-200/70 bg-white/60 p-4">
            <h2 className="text-[1.2rem] font-semibold text-slate-900">Git-basierte Timeline</h2>
            <ol className="mt-3 space-y-3">
              {events.map((event) => (
                <li key={event.id} className="rounded-xl border border-slate-200/70 bg-slate-50/75 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
                      {event.date} · Phase {event.phase}
                    </p>
                    <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-700">
                      Impact {event.impactScore}
                    </span>
                  </div>
                  <p className="mt-1 text-sm"><span className="font-semibold">Kontext:</span> {event.context}</p>
                  <p className="mt-1 text-sm"><span className="font-semibold">Entscheidung:</span> {event.decision}</p>
                  <p className="mt-1 text-sm"><span className="font-semibold">Warum:</span> {event.why}</p>
                  <p className="mt-1 text-sm"><span className="font-semibold">Ergebnis:</span> {event.result}</p>
                  <p className="mt-1 text-sm"><span className="font-semibold">Trade-off:</span> {event.tradeoffs}</p>
                  <details className="mt-2 rounded-md border border-slate-200/70 bg-white/70 p-2">
                    <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.1em] text-slate-600">
                      Commit-Referenzen ({event.commitRefs.length})
                    </summary>
                    <ul className="mt-2 space-y-1 text-xs text-slate-600">
                      {event.commitRefs.map((ref) => (
                        <li key={ref}>{ref}</li>
                      ))}
                    </ul>
                  </details>
                </li>
              ))}
            </ol>
          </section>

          <section className="rounded-2xl border border-slate-200/70 bg-white/60 p-4">
            <h2 className="text-[1.2rem] font-semibold text-slate-900">Kuratiertes Fazit</h2>
            <div className="mt-3 space-y-3">
              {caseStudy.map((entry) => (
                <article key={`${entry.date}-${entry.decision}`} className="rounded-xl border border-slate-200/70 bg-slate-50/75 p-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">{entry.date}</p>
                  <p className="mt-1 text-sm"><span className="font-semibold">Kontext:</span> {entry.context}</p>
                  <p className="mt-1 text-sm"><span className="font-semibold">Entscheidung:</span> {entry.decision}</p>
                  <p className="mt-1 text-sm"><span className="font-semibold">Ergebnis:</span> {entry.result}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-sky-200/80 bg-sky-50/75 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-sky-700">Was bringt mir das?</p>
            <p className="mt-2 text-sm leading-6 text-slate-800">
              Du kannst nachvollziehen, wann Multi-Agent im Projekt geholfen hat und wann ein fokussierter Single-Agent die bessere Delivery-Wahl war.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <TrackedLink
                href="/blog/multi-agent-vs-single-agent"
                label="Zum Detailartikel"
                eventName="lab_cta_click"
                payload={{ target: "blog" }}
                className="rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
              />
              <TrackedLink
                href="https://www.linkedin.com/"
                label="Diskussion auf LinkedIn"
                eventName="lab_cta_click"
                payload={{ target: "linkedin" }}
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                external
              />
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
