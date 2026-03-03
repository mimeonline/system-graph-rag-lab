"use client";

import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/config/site";
import { TrackedLink } from "@/components/molecules/tracked-link";

export function SiteHeader(): React.JSX.Element {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-[#173663] bg-[#0c2345]/95 text-white backdrop-blur">
      <div className="mx-auto flex min-h-16 w-full max-w-[1180px] flex-wrap items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <p className="text-sm font-semibold tracking-[0.01em]">System GraphRAG Lab</p>
          <span className="hidden text-[11px] uppercase tracking-[0.16em] text-slate-300 sm:inline">Public Showcase</span>
        </div>
        <nav className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <TrackedLink
                key={link.href}
                href={link.href}
                label={link.label}
                eventName="nav_click"
                payload={{ href: link.href }}
                className={`rounded-md px-2.5 py-1.5 transition ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "text-slate-100 hover:bg-white/10"
                }`}
              />
            );
          })}
        </nav>
      </div>
    </header>
  );
}
