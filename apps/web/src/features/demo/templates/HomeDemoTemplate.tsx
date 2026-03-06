import { QueryPanel } from "@/components/organisms/query-panel";
import { SiteFooter } from "@/components/organisms/site-footer";
import { SiteHeader } from "@/components/organisms/site-header";
import { HeroLearningStage } from "@/features/home/organisms/HeroLearningStage";

export async function HomeDemoTemplate(): Promise<React.JSX.Element> {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <SiteHeader />

      <main className="flex-1">
        <section className="full-bleed-safe relative overflow-x-clip">
          <HeroLearningStage />
        </section>

        <section className="mx-auto w-full max-w-295 px-4 py-8 sm:px-6 sm:py-10">
          <div id="antwortfuehrung" className="scroll-mt-24 sm:scroll-mt-28">
            <QueryPanel />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
