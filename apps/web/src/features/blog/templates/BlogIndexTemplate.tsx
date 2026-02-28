import { SiteFooter } from "@/components/organisms/site-footer";
import { SiteHeader } from "@/components/organisms/site-header";
import { TrackedPageView } from "@/components/molecules/tracked-page-view";
import type { BlogPostSummary } from "@/features/blog/contracts";
import { GraphEssaysSurface } from "@/features/blog/organisms/GraphEssaysSurface";

type BlogIndexTemplateProps = {
  posts: BlogPostSummary[];
};

type GraphEssayEntry = {
  title: string;
  thesis: string;
  slug: string;
};

type GraphEssayGroup = {
  title: string;
  entries: GraphEssayEntry[];
};

const ESSAY_GROUPS: GraphEssayGroup[] = [
  {
    title: "Problemraum",
    entries: [
      {
        title: "Warum KI-Antworten für Entscheidungen nicht ausreichen",
        thesis: "Plausibilität ersetzt keine nachvollziehbare Herleitung in entscheidungsrelevanten Kontexten.",
        slug: "warum-ki-antworten-fuer-entscheidungen-nicht-ausreichen",
      },
    ],
  },
  {
    title: "Struktur & Differenzierung",
    entries: [
      {
        title: "Was GraphRAG strukturell anders macht als klassisches RAG",
        thesis: "GraphRAG ergänzt Textretrieval um explizite Beziehungen und macht dadurch den Argumentationspfad sichtbar.",
        slug: "was-graphrag-strukturell-anders-macht-als-klassisches-rag",
      },
      {
        title: "Kontextdisziplin: Warum weniger Kontext oft bessere Antworten erzeugt",
        thesis: "Gezielte Kontextauswahl reduziert Rauschen und erhöht die Belastbarkeit der Antwort.",
        slug: "kontextdisziplin-warum-weniger-kontext-oft-bessere-antworten-erzeugt",
      },
    ],
  },
  {
    title: "Qualitäts- & Architekturprinzipien",
    entries: [
      {
        title: "Qualitätskriterien für ein produktives GraphRAG-System",
        thesis: "Ein produktives System braucht klare Qualitätskriterien für Retrieval, Herleitung und Antwortstabilität.",
        slug: "qualitaetskriterien-fuer-ein-produktives-graphrag-system",
      },
      {
        title: "Prompt-Transparenz als Vertrauensfaktor",
        thesis: "Transparente Prompt-Bausteine machen die Antwortentstehung prüfbar und diskutierbar.",
        slug: "prompt-transparenz-als-vertrauensfaktor",
      },
    ],
  },
  {
    title: "Organisation & Anwendung",
    entries: [
      {
        title: "GraphRAG als Entscheidungs-Interface für Organisationen",
        thesis: "GraphRAG verbindet Fachkontext, Belege und Entscheidungspfade in einer arbeitsfähigen Oberfläche.",
        slug: "graphrag-als-entscheidungs-interface-fuer-organisationen",
      },
      {
        title: "System Thinking als idealer Use Case für GraphRAG",
        thesis: "System Thinking zeigt, warum relationale Kontextstruktur in komplexen Problemräumen entscheidend ist.",
        slug: "system-thinking-als-idealer-use-case-fuer-graphrag",
      },
    ],
  },
  {
    title: "Positionierung",
    entries: [
      {
        title: "Von plausiblen Antworten zu prüfbaren Entscheidungen",
        thesis: "Der Mehrwert entsteht, wenn Antworten nicht nur plausibel klingen, sondern belastbar überprüft werden können.",
        slug: "von-plausiblen-antworten-zu-pruefbaren-entscheidungen",
      },
    ],
  },
];

export function BlogIndexTemplate({ posts }: BlogIndexTemplateProps): React.JSX.Element {
  void posts.length;

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900">
      <TrackedPageView page="/blog" />
      <SiteHeader />

      <main className="flex-1">
        <section className="mx-auto w-full max-w-295 px-4 py-8 sm:px-6 sm:py-10">
          <div className="space-y-4">
            <h1 className="max-w-[20ch] text-[2rem] font-semibold tracking-tight text-slate-950 sm:text-[2.4rem]">Graph Essays</h1>
            <p className="max-w-[66ch] text-base leading-7 text-slate-700">
              Wie aus KI-Antworten belastbare Entscheidungen werden.
            </p>
            <p className="max-w-[76ch] text-sm leading-7 text-slate-600 sm:text-base">
              Die Beiträge sind als zusammenhängender Gedankengang dargestellt – vom Problem bis zur Einordnung. Jeder Knoten steht für einen wichtigen Schritt im Argument.
            </p>
          </div>
        </section>

        <section className="space-y-3 pb-2">
          <div className="mx-auto flex w-full max-w-295 items-end justify-between gap-4 px-4 sm:px-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-slate-500">Argumentationsfluss</h2>
            <p className="text-xs text-slate-500">Problemraum → Struktur → Qualität → Organisation → Positionierung</p>
          </div>
          <GraphEssaysSurface />
        </section>

        <section className="mx-auto w-full max-w-295 px-4 pb-10 pt-8 sm:px-6 sm:pb-12">
          <div className="space-y-4 border-t border-slate-200 pt-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-slate-600">Essays als Liste</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {ESSAY_GROUPS.map((group) => (
                <article key={group.title} className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
                  <h3 className="text-sm font-semibold tracking-tight text-slate-900">{group.title}</h3>
                  <ul className="mt-3 space-y-2">
                    {group.entries.map((entry) => (
                      <li key={entry.slug}>
                        <a
                          href={`/blog/${entry.slug}`}
                          className="text-sm text-slate-700 underline decoration-slate-300 underline-offset-2 transition hover:text-slate-900 hover:decoration-slate-500"
                        >
                          {entry.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
