import { QueryPanel } from "@/components/organisms/query-panel";
import { SiteFooter } from "@/components/organisms/site-footer";
import { SiteHeader } from "@/components/organisms/site-header";
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
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <SiteHeader />

      <main className="flex-1">
        <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen">
          <HeroLearningStage />
        </section>

        <div className="mx-auto grid w-full max-w-295 gap-10 px-4 py-12 sm:px-6 sm:py-16">
          <div id="antwortfuehrung" className="scroll-mt-24 sm:scroll-mt-28">
            <QueryPanel />
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
