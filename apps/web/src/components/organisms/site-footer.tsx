import { TrackedLink } from "@/components/molecules/tracked-link";

export function SiteFooter(): React.JSX.Element {
  return (
    <footer className="border-t border-[#12335f] bg-[#0a1f3b] text-slate-200">
      <div className="mx-auto flex min-h-[56px] w-full max-w-[1180px] flex-wrap items-center justify-between gap-2 px-4 py-2 text-xs sm:px-6">
        <div>
          <p className="font-semibold text-slate-100">System GraphRAG Public MVP</p>
          <p className="text-[11px] text-slate-300">GraphRAG, Agent-Workflows und nachvollziehbare KI-Entscheidungen</p>
        </div>
        <div className="flex items-center gap-3">
          <TrackedLink
            href="mailto:hello@example.com?subject=Projektanfrage%20GraphRAG"
            label="Kontakt"
            eventName="footer_click"
            payload={{ target: "contact" }}
            className="text-slate-100 underline decoration-slate-400 underline-offset-2"
            external
          />
          <TrackedLink
            href="https://github.com/"
            label="GitHub"
            eventName="footer_click"
            payload={{ target: "github" }}
            className="text-slate-100 underline decoration-slate-400 underline-offset-2"
            external
          />
          <TrackedLink
            href="https://www.linkedin.com/"
            label="LinkedIn"
            eventName="footer_click"
            payload={{ target: "linkedin" }}
            className="text-slate-100 underline decoration-slate-400 underline-offset-2"
            external
          />
        </div>
      </div>
    </footer>
  );
}
