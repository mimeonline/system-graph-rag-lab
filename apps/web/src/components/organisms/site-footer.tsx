import { TrackedLink } from "@/components/molecules/tracked-link";

export function SiteFooter(): React.JSX.Element {
  return (
    <footer className="border-t border-[#12335f] bg-[#0a1f3b] text-slate-200">
      <div className="mx-auto flex min-h-[56px] w-full max-w-[1180px] flex-wrap items-center justify-between gap-2 px-4 py-2 text-xs sm:px-6">
        <div className="min-w-0">
          <p className="font-semibold text-slate-100">System GraphRAG Public MVP</p>
          <p className="text-[11px] text-slate-300">GraphRAG, Agent-Workflows und nachvollziehbare KI-Entscheidungen</p>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <TrackedLink
            href="/about"
            label="About"
            eventName="footer_click"
            payload={{ target: "about" }}
            className="text-slate-100 underline decoration-slate-400 underline-offset-2"
          />
          <TrackedLink
            href="https://github.com/mimeonline/system-graph-rag-lab"
            label="GitHub"
            eventName="footer_click"
            payload={{ target: "github" }}
            className="text-slate-100 underline decoration-slate-400 underline-offset-2"
            external
          />
          <TrackedLink
            href="https://www.linkedin.com/in/michael-meierhoff-b5426458/"
            label="LinkedIn"
            eventName="footer_click"
            payload={{ target: "linkedin" }}
            className="text-slate-100 underline decoration-slate-400 underline-offset-2"
            external
          />
          <TrackedLink
            href="/datenschutz"
            label="Datenschutz"
            eventName="footer_click"
            payload={{ target: "privacy" }}
            className="text-slate-100 underline decoration-slate-400 underline-offset-2"
          />
          <TrackedLink
            href="/impressum"
            label="Impressum"
            eventName="footer_click"
            payload={{ target: "imprint" }}
            className="text-slate-100 underline decoration-slate-400 underline-offset-2"
          />
        </div>
      </div>
    </footer>
  );
}
