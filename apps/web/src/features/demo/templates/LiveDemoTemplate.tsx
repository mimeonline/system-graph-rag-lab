import { QueryPanel } from "@/components/organisms/query-panel";
import { SiteFooter } from "@/components/organisms/site-footer";
import { SiteHeader } from "@/components/organisms/site-header";

type LiveDemoTemplateProps = {
  locale: "de" | "en";
};

export function LiveDemoTemplate({ locale }: LiveDemoTemplateProps): React.JSX.Element {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <SiteHeader />

      <main className="flex-1">
        <section className="mx-auto w-full max-w-295 px-4 py-10 sm:px-6 sm:py-14">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-700">
              {locale === "en" ? "Live mode" : "Live-Modus"}
            </p>
            <h1 className="headline-wrap mt-3 max-w-4xl text-[2rem] font-bold leading-tight tracking-tight text-slate-950 sm:text-[2.8rem]">
              {locale === "en" ? "Real System Thinking query pipeline" : "Echte System-Thinking-Query-Pipeline"}
            </h1>
            <p className="mt-4 max-w-3xl text-base font-medium leading-relaxed text-slate-700">
              {locale === "en"
                ? "This legacy live demo remains available separately. It uses the existing local Neo4j and OpenAI query flow when the services are running."
                : "Diese bisherige Live-Demo bleibt separat verfügbar. Sie nutzt den bestehenden lokalen Neo4j- und OpenAI-Query-Flow, wenn die Dienste laufen."}
            </p>
          </div>

          <div id="antwortfuehrung" className="scroll-mt-24 sm:scroll-mt-28">
            <QueryPanel locale={locale} />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
