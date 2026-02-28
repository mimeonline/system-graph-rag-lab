import { QueryPanel } from "@/components/organisms/query-panel";
import { SiteFooter } from "@/components/organisms/site-footer";
import { SiteHeader } from "@/components/organisms/site-header";
import { TrackedLink } from "@/components/molecules/tracked-link";
import { PRIMARY_CTA, SOCIAL_CTA } from "@/config/site";
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
    <div className="flex min-h-screen flex-col bg-white text-slate-900">
      <SiteHeader />

      <main className="flex-1">
        <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen">
          <HeroLearningStage />
        </section>

        <div className="mx-auto grid w-full max-w-295 gap-10 px-4 py-8 sm:px-6 sm:py-10">
          <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-slate-50 py-10 sm:py-12">
            <div className="mx-auto w-full max-w-295 px-4 sm:px-6">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Proof statt Buzzword</h2>
                <p className="mt-1 text-sm text-slate-700">
                  Öffentliche Demo, nachvollziehbarer Graph, echte Referenzen und klare Herleitung.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <TrackedLink
                  href={PRIMARY_CTA.href}
                  label={PRIMARY_CTA.label}
                  eventName="cta_click"
                  payload={{ surface: "home-proof", priority: PRIMARY_CTA.priority }}
                  className="rounded-md bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700"
                />
                {SOCIAL_CTA.map((cta) => (
                  <TrackedLink
                    key={cta.label}
                    href={cta.href}
                    label={cta.label}
                    eventName="cta_click"
                    payload={{ surface: "home-proof", target: cta.label.toLowerCase() }}
                    className="rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-700"
                    external
                  />
                ))}
              </div>
            </div>
            </div>
          </section>

          <QueryPanel />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
