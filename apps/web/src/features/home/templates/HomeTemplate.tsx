import { QueryPanel } from "@/components/organisms/query-panel";
import { HeroLearningStage } from "@/features/home/organisms/HeroLearningStage";

/**
 * Zweck:
 * Rendert die Home-Ansicht als Template-Komposition ohne Business-Logik.
 *
 * Input:
 * - keiner
 *
 * Output:
 * - React.JSX.Element fuer die Startseite des MVP
 *
 * Fehlerfall:
 * - Kein eigener Fehlerpfad, Rendering folgt React-Komponentenbaum
 *
 * Beispiel:
 * - <HomeTemplate />
 */
export function HomeTemplate(): React.JSX.Element {
  return (
    <div className="flex min-h-screen flex-col bg-[#f4f8ff] text-slate-900">
      <header className="border-b border-[#16335d] bg-[#0c2345] text-white">
        <div className="mx-auto flex min-h-16 w-full max-w-[1180px] items-center justify-between gap-4 px-4 sm:px-6">
          <p className="text-sm font-semibold tracking-[0.01em]">System GraphRAG Demo</p>
          <p className="text-xs text-slate-200 sm:text-sm">GitHub · Info</p>
        </div>
      </header>

      <main className="flex-1 px-4 py-5 sm:px-6 sm:py-6">
        <div className="mx-auto grid w-full max-w-[1180px] gap-6">
          <HeroLearningStage />
          <QueryPanel />
        </div>
      </main>

      <footer className="border-t border-[#12335f] bg-[#0a1f3b] text-slate-200">
        <div className="mx-auto flex min-h-[52px] w-full max-w-[1180px] items-center justify-between gap-4 px-4 text-xs sm:px-6">
          <span>System GraphRAG Public MVP</span>
          <span className="text-right">Lernfokussierte UI mit sichtbarer Herleitung und klarer Handlungsebene</span>
        </div>
      </footer>
    </div>
  );
}
