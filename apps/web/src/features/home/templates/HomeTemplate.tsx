import { QueryPanel } from "@/components/organisms/query-panel";
import { SiteFooter } from "@/components/organisms/site-footer";
import { SiteHeader } from "@/components/organisms/site-header";
import { HeroLearningStage } from "@/features/home/organisms/HeroLearningStage";

type HomeTemplateProps = {
  heroSlot?: React.ReactNode;
};

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
export function HomeTemplate({ heroSlot }: HomeTemplateProps = {}): React.JSX.Element {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <SiteHeader />

      <main className="flex-1">
        {heroSlot ?? (
          <section className="full-bleed-safe relative overflow-x-clip">
            <HeroLearningStage />
          </section>
        )}

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
