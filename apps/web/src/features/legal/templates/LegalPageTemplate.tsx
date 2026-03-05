import { TrackedPageView } from "@/components/molecules/tracked-page-view";
import { SiteFooter } from "@/components/organisms/site-footer";
import { SiteHeader } from "@/components/organisms/site-header";

type LegalPageTemplateProps = {
  pagePath: "/datenschutz" | "/impressum";
  badge: string;
  title: string;
  intro: string;
  children: React.ReactNode;
};

export function LegalPageTemplate({
  pagePath,
  badge,
  title,
  intro,
  children,
}: LegalPageTemplateProps): React.JSX.Element {
  return (
    <div className="flex min-h-screen flex-col bg-transparent text-slate-900">
      <TrackedPageView page={pagePath} />
      <SiteHeader />

      <main className="flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <section className="mx-auto w-full max-w-295 space-y-8">
          <header className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">{badge}</p>
            <h1 className="headline-wrap text-[2rem] font-bold tracking-tight text-slate-950 sm:text-[2.5rem]">{title}</h1>
            <p className="max-w-[85ch] text-[1.02rem] leading-relaxed text-slate-700">{intro}</p>
          </header>

          <article className="glass-panel rounded-3xl border border-slate-200/70 p-6 sm:p-8">
            <div className="space-y-8 text-[0.98rem] leading-relaxed text-slate-700">{children}</div>
          </article>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
