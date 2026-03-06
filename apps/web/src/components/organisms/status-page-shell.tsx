import type { ReactNode } from "react";
import { Activity, ArrowRight, Compass, FileSearch, Home, Sparkles } from "lucide-react";
import { SiteFooter } from "@/components/organisms/site-footer";
import { SiteHeader } from "@/components/organisms/site-header";
import { Link } from "@/i18n/navigation";

type StatusLink = {
  href: "/" | "/demo" | "/story/graphrag" | "/essay";
  label: string;
  description: string;
};

type StatusPageShellProps = {
  code: string;
  eyebrow: string;
  title: string;
  description: string;
  summary: string;
  statusLabel: string;
  recoveryTitle: string;
  recoveryDescription: string;
  primaryAction?: ReactNode;
  secondaryActions?: ReactNode[];
  checklistTitle: string;
  checklistItems: string[];
  routesTitle: string;
  routeLinks: StatusLink[];
};

const routeIcons = {
  "/": Home,
  "/demo": Sparkles,
  "/story/graphrag": Activity,
  "/essay": FileSearch,
} satisfies Record<StatusLink["href"], typeof Home>;

export function StatusPageShell({
  code,
  eyebrow,
  title,
  description,
  summary,
  statusLabel,
  recoveryTitle,
  recoveryDescription,
  primaryAction,
  secondaryActions = [],
  checklistTitle,
  checklistItems,
  routesTitle,
  routeLinks,
}: StatusPageShellProps): React.JSX.Element {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <SiteHeader />
      <main className="flex-1 overflow-hidden">
        <section className="relative isolate px-4 py-10 sm:px-6 sm:py-14">
          <div
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(900px_420px_at_10%_0%,rgba(14,165,233,0.14),transparent_70%),radial-gradient(800px_360px_at_100%_10%,rgba(15,35,77,0.08),transparent_65%)]"
            aria-hidden
          />
          <div className="mx-auto grid w-full max-w-[1180px] gap-6 lg:grid-cols-[minmax(0,1.4fr)_360px]">
            <section className="glass-panel rounded-[28px] p-6 sm:p-8 lg:p-10">
              <div className="inline-flex items-center gap-3 rounded-full border border-sky-200/70 bg-sky-50/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-sky-800">
                <span>{eyebrow}</span>
                <span className="text-sky-300">•</span>
                <span>{code}</span>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-start">
                <div className="space-y-5">
                  <div className="space-y-4">
                    <h1 className="headline-wrap max-w-[16ch] text-[2.25rem] font-bold leading-[1.04] tracking-tight text-slate-950 sm:text-[3.5rem]">
                      {title}
                    </h1>
                    <p className="max-w-[68ch] text-[1.05rem] font-medium leading-relaxed text-slate-700 sm:text-[1.15rem]">
                      {description}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-sm">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">{statusLabel}</p>
                    <p className="mt-2 max-w-[62ch] text-sm leading-6 text-slate-700 sm:text-[0.98rem]">{summary}</p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {primaryAction}
                    {secondaryActions}
                  </div>
                </div>

                <div className="relative min-h-[180px] overflow-hidden rounded-[26px] border border-slate-200/70 bg-[linear-gradient(180deg,#0c2345_0%,#12335f_100%)] p-5 text-white shadow-[0_18px_50px_rgba(12,35,69,0.22)]">
                  <div
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(140%_90%_at_0%_0%,rgba(125,211,252,0.2),transparent_55%),radial-gradient(120%_80%_at_100%_100%,rgba(56,189,248,0.12),transparent_55%)]"
                    aria-hidden
                  />
                  <div className="relative">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                      <Compass className="h-5 w-5 text-sky-200" aria-hidden />
                    </div>
                    <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.16em] text-sky-200/90">{recoveryTitle}</p>
                    <p className="mt-2 text-lg font-semibold tracking-tight text-white">{code}</p>
                    <p className="mt-3 text-sm leading-6 text-slate-200">{recoveryDescription}</p>
                  </div>
                </div>
              </div>
            </section>

            <aside className="space-y-6">
              <section className="glass-panel rounded-[24px] p-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">{checklistTitle}</p>
                <div className="mt-4 space-y-3">
                  {checklistItems.map((item) => (
                    <div key={item} className="flex items-start gap-3 rounded-xl border border-slate-200/70 bg-white/80 px-4 py-3">
                      <span className="mt-1 block h-2 w-2 shrink-0 rounded-full bg-sky-500" aria-hidden />
                      <p className="text-sm leading-6 text-slate-700">{item}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="glass-panel rounded-[24px] p-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">{routesTitle}</p>
                <div className="mt-4 space-y-3">
                  {routeLinks.map((routeLink) => {
                    const Icon = routeIcons[routeLink.href];

                    return (
                      <Link
                        key={routeLink.href}
                        href={routeLink.href}
                        className="group flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-white/85 p-4 transition-all hover:-translate-y-0.5 hover:border-sky-300/60 hover:shadow-sm"
                      >
                        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700 ring-1 ring-sky-100">
                          <Icon className="h-4 w-4" aria-hidden />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold text-slate-900">{routeLink.label}</span>
                          <span className="mt-1 block text-sm leading-5 text-slate-600">{routeLink.description}</span>
                        </span>
                        <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-sky-600" aria-hidden />
                      </Link>
                    );
                  })}
                </div>
              </section>
            </aside>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
