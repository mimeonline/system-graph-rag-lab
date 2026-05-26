import { ArrowRight, CheckCircle2, HelpCircle, Scale } from "lucide-react";
import * as motion from "framer-motion/client";

import { TrackedLink } from "@/components/molecules/tracked-link";
import { TrackedPageView } from "@/components/molecules/tracked-page-view";
import { SiteFooter } from "@/components/organisms/site-footer";
import { SiteHeader } from "@/components/organisms/site-header";
import { DEMO_GRAPH_TYPES } from "@/features/demo/graph-type-learning-model";
import { ExecutiveHeroGraph } from "@/features/landing/molecules/ExecutiveHeroGraph";
import { LandingReveal } from "@/features/landing/molecules/LandingReveal";

type ExecutiveLandingTemplateProps = {
  locale: "de" | "en";
};

export async function ExecutiveLandingTemplate({
  locale,
}: ExecutiveLandingTemplateProps): Promise<React.JSX.Element> {
  const isEn = locale === "en";
  const faqs = isEn
    ? [
        {
          question: "Is this a legal advice tool?",
          answer:
            "No. The EU AI Act is used as a realistic learning example. The demo explains GraphRAG modelling patterns, not binding legal assessments.",
        },
        {
          question: "Why five graph types instead of one graph?",
          answer:
            "Because document evidence, domain responsibility, semantic meaning, conversation memory, and time validity solve different problems.",
        },
        {
          question: "Does the demo need live AI calls?",
          answer:
            "The learning mode is simulated on purpose. That makes the intermediate steps visible and avoids depending on external services.",
        },
      ]
    : [
        {
          question: "Ist das ein Rechtsberatungs-Tool?",
          answer:
            "Nein. Der EU AI Act dient als realistisches Lernbeispiel. Die Demo erklärt GraphRAG-Modellierung, keine verbindliche rechtliche Bewertung.",
        },
        {
          question: "Warum fünf Graph-Typen statt ein Graph?",
          answer:
            "Weil Dokumentbelege, fachliche Verantwortung, semantische Bedeutung, Gesprächs-Memory und zeitliche Gültigkeit unterschiedliche Probleme lösen.",
        },
        {
          question: "Braucht die Demo echte KI-Aufrufe?",
          answer:
            "Der Lernmodus ist bewusst simuliert. Dadurch werden Zwischenschritte sichtbar und die Demo hängt nicht von externen Diensten ab.",
        },
      ];

  return (
    <div className="flex min-h-screen flex-col bg-transparent text-slate-900">
      <TrackedPageView page="/" />
      <SiteHeader />

      <main className="flex-1">
        <section className="relative overflow-hidden bg-white px-4 py-14 sm:px-6 sm:py-18">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-100/80 via-white to-sky-50/50" />
          <div className="mx-auto grid w-full max-w-295 gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(340px,0.7fr)] lg:items-center">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="space-y-6"
            >
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-700">
                {isEn ? "GraphRAG learning lab" : "GraphRAG Lernlabor"}
              </p>
              <h1 className="headline-wrap max-w-4xl text-[2.2rem] font-bold leading-tight tracking-tight text-slate-950 sm:text-[3.45rem]">
                {isEn
                  ? "Understand GraphRAG through five graph types."
                  : "GraphRAG über fünf Graph-Typen verstehen."}
              </h1>
              <p className="max-w-3xl text-[1.08rem] font-medium leading-relaxed text-slate-700 sm:text-[1.18rem]">
                {isEn
                  ? "A guided EU AI Act launch decision shows why GraphRAG is not one graph, but a modelling choice across documents, domains, knowledge, conversations, and time."
                  : "Eine geführte EU-AI-Act-Launch-Entscheidung zeigt, warum GraphRAG nicht ein einzelner Graph ist, sondern eine Modellierungsentscheidung über Dokumente, Domänen, Wissen, Gespräche und Zeit."}
              </p>
              <div className="flex flex-wrap gap-3">
                <TrackedLink
                  href="/demo"
                  label={isEn ? "Test demo now" : "Demo jetzt testen"}
                  eventName="landing_cta_click"
                  payload={{ target: "/demo", surface: "hero-primary" }}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-sky-700"
                  icon={<ArrowRight className="h-4 w-4" aria-hidden />}
                />
                <TrackedLink
                  href="/story/graphrag"
                  label={isEn ? "Read the story" : "Story lesen"}
                  eventName="landing_cta_click"
                  payload={{ target: "/story/graphrag", surface: "hero-secondary" }}
                  className="inline-flex rounded-xl border border-slate-300 bg-white/80 px-6 py-3.5 text-sm font-bold text-slate-800 transition hover:-translate-y-0.5 hover:border-sky-300 hover:text-sky-700"
                />
              </div>
            </motion.div>

            <div className="rounded-3xl border border-slate-200 bg-linear-to-b from-white to-slate-50 p-4 shadow-sm sm:p-5">
              <ExecutiveHeroGraph locale={locale} />
            </div>
          </div>
        </section>

        <LandingReveal>
          <section className="mx-auto w-full max-w-295 px-4 py-12 sm:px-6 sm:py-16">
            <div className="mb-8 max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-700">
                {isEn ? "The method map" : "Die Methoden-Landkarte"}
              </p>
              <h2 className="mt-3 text-2xl font-bold text-slate-950 sm:text-3xl">
                {isEn ? "Five graph types, five different jobs" : "Fünf Graph-Typen, fünf unterschiedliche Aufgaben"}
              </h2>
              <p className="mt-3 text-base font-medium leading-relaxed text-slate-700">
                {isEn
                  ? "Each type explains a different part of the GraphRAG architecture. The demo overview links into the dedicated learning pages."
                  : "Jeder Typ erklärt einen anderen Teil der GraphRAG-Architektur. Die Demo-Übersicht führt in die einzelnen Lernseiten."}
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-5">
              {DEMO_GRAPH_TYPES.map((graphType) => {
                const Icon = graphType.icon;
                return (
                  <TrackedLink
                    key={graphType.id}
                    href={`/demo/${graphType.slug}`}
                    label={graphType.title}
                    eventName="landing_graph_type_click"
                    payload={{ graphType: graphType.id }}
                    className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-sky-300 hover:shadow-md"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-2xl font-bold text-slate-300">{graphType.number}</span>
                      <Icon className="h-5 w-5 text-sky-600" aria-hidden />
                    </div>
                    <h3 className="mt-4 text-base font-bold text-slate-950">{graphType.title}</h3>
                    <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{graphType.badge}</p>
                    <p className="mt-3 text-sm font-medium leading-relaxed text-slate-700">{graphType.genericDefinition}</p>
                  </TrackedLink>
                );
              })}
            </div>
          </section>
        </LandingReveal>

        <LandingReveal>
          <section className="full-bleed-safe border-y border-slate-200 bg-slate-50 px-4 py-12 sm:px-6 sm:py-16">
            <div className="mx-auto grid w-full max-w-295 gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(340px,0.65fr)] lg:items-start">
              <div>
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-sky-700">
                  <Scale className="h-4 w-4" aria-hidden />
                  <span>{isEn ? "Concrete example" : "Konkretes Beispiel"}</span>
                </p>
                <h2 className="mt-3 text-2xl font-bold text-slate-950 sm:text-3xl">
                  {isEn ? "One EU AI Act launch decision as the red thread" : "Eine EU-AI-Act-Launch-Entscheidung als roter Faden"}
                </h2>
                <p className="mt-4 max-w-3xl text-base font-medium leading-relaxed text-slate-700">
                  {isEn
                    ? "The same question is viewed through each graph type: Can an AI feature be launched for EU customers, and what evidence, roles, obligations, memory, and timing matter?"
                    : "Dieselbe Frage wird durch jeden Graph-Typ betrachtet: Darf ein KI-Feature für EU-Kunden gelauncht werden, und welche Belege, Rollen, Pflichten, Gesprächskontexte und Zeitpunkte sind relevant?"}
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                  {isEn ? "What becomes visible" : "Was sichtbar wird"}
                </p>
                <ul className="mt-4 space-y-3 text-sm font-medium leading-relaxed text-slate-700">
                  {(isEn
                    ? [
                        "What the user contributes and controls",
                        "What is stored in the graph",
                        "What context package the LLM receives",
                        "Where the answer is evidence-bound",
                      ]
                    : [
                        "Was der User beiträgt und steuert",
                        "Was im Graph gespeichert ist",
                        "Welches Kontextpaket das LLM bekommt",
                        "Wo die Antwort belegt und begrenzt ist",
                      ]).map((item) => (
                    <li key={item} className="flex gap-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </LandingReveal>

        <LandingReveal>
          <section className="mx-auto w-full max-w-295 px-4 py-12 sm:px-6 sm:py-16">
            <div className="mb-8 max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-700">FAQ</p>
              <h2 className="mt-3 text-2xl font-bold text-slate-950 sm:text-3xl">
                {isEn ? "Common questions before you start" : "Häufige Fragen vor dem Einstieg"}
              </h2>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              {faqs.map((faq) => (
                <article key={faq.question} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <HelpCircle className="h-5 w-5 text-sky-600" aria-hidden />
                  <h3 className="mt-4 text-base font-bold text-slate-950">{faq.question}</h3>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-slate-700">{faq.answer}</p>
                </article>
              ))}
            </div>
          </section>
        </LandingReveal>

        <LandingReveal>
          <section className="bg-white px-4 py-14 sm:px-6 sm:py-18">
            <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-slate-950 p-8 text-center text-white shadow-xl shadow-slate-900/15 sm:p-12">
              <h2 className="headline-wrap text-2xl font-bold sm:text-3xl">
                {isEn ? "Test the method map now." : "Teste die Methoden-Landkarte jetzt."}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-relaxed text-slate-300">
                {isEn
                  ? "Start with the overview, pick a graph type, and inspect how user, graph, and LLM interact."
                  : "Starte mit der Übersicht, wähle einen Graph-Typ und sieh dir an, wie User, Graph und LLM zusammenspielen."}
              </p>
              <TrackedLink
                href="/demo"
                label={isEn ? "Test demo now" : "Demo jetzt testen"}
                eventName="landing_cta_click"
                payload={{ target: "/demo", surface: "closing-cta" }}
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-sky-100"
                icon={<ArrowRight className="h-4 w-4" aria-hidden />}
              />
            </div>
          </section>
        </LandingReveal>
      </main>

      <SiteFooter />
    </div>
  );
}
