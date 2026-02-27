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
    <div className="flex min-h-screen flex-col bg-[#f4f8ff] text-slate-900">
      <SiteHeader />

      <main className="flex-1 px-4 py-5 sm:px-6 sm:py-6">
        <div className="mx-auto grid w-full max-w-[1180px] gap-8">
          <HeroLearningStage />
          <section className="rounded-2xl border border-slate-200/70 bg-white/55 p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
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
                  className="rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
                />
                {SOCIAL_CTA.map((cta) => (
                  <TrackedLink
                    key={cta.label}
                    href={cta.href}
                    label={cta.label}
                    eventName="cta_click"
                    payload={{ surface: "home-proof", target: cta.label.toLowerCase() }}
                    className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    external
                  />
                ))}
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
