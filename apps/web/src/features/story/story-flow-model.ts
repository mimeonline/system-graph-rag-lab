export type StoryPerspective = "architecture" | "product" | "governance";

export type StoryChapterId = "question" | "retrieval" | "graph" | "synthesis" | "action";

export type StoryChapter = {
  id: StoryChapterId;
  label: string;
  goal: string;
  technicalFlow: string;
  structuralRelevance: string;
  visualSpec: string;
  keyInsight: string;
  keyTerms: string[];
  beforeAfter: { before: string; after: string };
  nextStepHint: string;
  perspectiveCopy: Record<StoryPerspective, string>;
};

export type StoryPrimaryAction = {
  label: string;
  isDemoLink: boolean;
};

export function getStoryPerspectives(locale: "de" | "en"): Array<{ id: StoryPerspective; label: string }> {
  return locale === "en"
    ? [
        { id: "architecture", label: "Architecture" },
        { id: "product", label: "Product" },
        { id: "governance", label: "Governance" },
      ]
    : [
        { id: "architecture", label: "Architektur" },
        { id: "product", label: "Produkt" },
        { id: "governance", label: "Governance" },
      ];
}

export function getStoryChapters(locale: "de" | "en"): StoryChapter[] {
  if (locale === "en") {
    return [
      {
        id: "question",
        label: "Question",
        goal: "Frame the system problem",
        technicalFlow:
          "We turn the initial request into a clear core question. We name the objective, the boundary, and the expected effect explicitly so that everyone starts from the same point. We also clarify terms that could otherwise be understood differently.",
        structuralRelevance:
          "If the question stays vague, the later answers will also stay vague or contradictory. A clean focus at the beginning avoids misunderstandings and keeps the decision space stable throughout the flow.",
        visualSpec:
          "Only the core question sits in the center. The surrounding space shows that assumptions already exist, but are not yet modeled as explicit relations. The visual makes one thing clear: we do not start with answers, we start with a precise shared understanding.",
        keyInsight: "Good decisions start with a clear question, not with data.",
        keyTerms: ["Decision space", "Problem node", "Implicit assumptions", "Goal framing"],
        beforeAfter: {
          before: "Vague text request to a model",
          after: "Precise problem node with objective and boundary",
        },
        nextStepHint: "With the clarified question, we now search for relevant context.",
        perspectiveCopy: {
          architecture:
            "Architecture: which system boundaries and dependencies truly matter here, and what is intentionally outside this decision space? This prevents secondary technical topics from overshadowing the core decision.",
          product:
            "Product: which user or business effect should this question clarify, and how will we later know that the decision helped? This keeps the flow tied to actual outcomes.",
          governance:
            "Governance: which rules, evidence requirements, and risks must be considered from the beginning so the decision can stand up to review?",
        },
      },
      {
        id: "retrieval",
        label: "Context",
        goal: "Prioritize context",
        technicalFlow:
          "We calculate the proximity between the core question and possible context nodes via embeddings and rank them by graph score. If needed, we expand by one hop to direct neighbors. Only these prioritized nodes move on as context for the LLM prompt.",
        structuralRelevance:
          "More context is not automatically better. Too much material weakens focus. Prioritization keeps the prompt precise and makes the selection path reproducible and reviewable.",
        visualSpec:
          "You see a centered context package containing the selected nodes for the prompt. Context with medium or low relevance remains visible on the outside. Selection follows score and hop rules, not chance.",
        keyInsight: "What matters is not the amount of context, but the discipline of selection.",
        keyTerms: ["Embedding match", "Graph score", "Hop expansion", "Prompt context"],
        beforeAfter: {
          before: "Unstructured full context inside the prompt",
          after: "Score-based node selection with optional hop expansion",
        },
        nextStepHint: "The prioritized nodes are now linked into a usable structure.",
        perspectiveCopy: {
          architecture:
            "Architecture: which sources truly clarify dependencies, and which only make the picture noisier without adding value?",
          product:
            "Product: which context actually changes the next step, and which is merely interesting but not decision-relevant?",
          governance:
            "Governance: which contexts are reliable, current, and documented well enough for later review and audit?",
        },
      },
      {
        id: "graph",
        label: "Graph",
        goal: "Select nodes for the LLM",
        technicalFlow:
          "We calculate the semantic proximity between the core question and graph nodes via embeddings. Then we select fitting concept nodes, add their supporting evidence, and expand to direct neighbors if needed. Exactly this subnet is then passed to the LLM as structured context.",
        structuralRelevance:
          "This keeps it visible which nodes enter the prompt and why. The context stays focused rather than arbitrarily large and becomes reproducible for identical inputs.",
        visualSpec:
          "The visualization first shows the core question, then fitting concepts, then their evidence. An additional edge marks optional hop expansion, so you can see exactly which nodes were selected for the LLM context.",
        keyInsight: "GraphRAG gains quality through traceable node selection, not through more text.",
        keyTerms: ["Embedding match", "Node selection", "Hop expansion", "Evidence link"],
        beforeAfter: {
          before: "Unfiltered context for the LLM",
          after: "Embedding-based node selection with evidence",
        },
        nextStepHint: "The network now turns into a reviewable reasoning path.",
        perspectiveCopy: {
          architecture:
            "Architecture: which nodes and edges must enter the prompt so technical dependencies are represented correctly?",
          product:
            "Product: which concepts really support the answer, and which intentionally stay outside the prompt context?",
          governance:
            "Governance: is it documented which nodes were selected with which score, and which were added through a hop?",
        },
      },
      {
        id: "synthesis",
        label: "Synthesis",
        goal: "Derive the answer",
        technicalFlow:
          "We pass the prioritized context package into the prompt and derive the answer along explicit nodes. The path from question to context to evidence to answer remains visible.",
        structuralRelevance:
          "A list of sources alone does not show reasoning logic. The derivation path makes visible how the answer was formed and where it can be inspected.",
        visualSpec:
          "You see a clear path from question to answer via context package and evidence. That makes the factual support of the final claim understandable at a glance.",
        keyInsight: "Traceability emerges from the derivation path, not from a source list.",
        keyTerms: ["Context package", "Prompt context", "Evidence path", "Traceability"],
        beforeAfter: {
          before: "Answer with an attached source list",
          after: "Traceable path: question -> context -> evidence -> answer",
        },
        nextStepHint: "The derivation now becomes an operational decision.",
        perspectiveCopy: {
          architecture:
            "Architecture: is the technical decision consistent across multiple steps, or does the rationale break at specific edges?",
          product:
            "Product: can we justify the prioritized action so that priority, impact, and risk stay understandable together?",
          governance:
            "Governance: can a review follow the conclusion without insider knowledge or oral explanation?",
        },
      },
      {
        id: "action",
        label: "Action",
        goal: "Use next steps",
        technicalFlow:
          "We take the evidence-based answer from the previous step and turn it into a clear decision. That decision is translated into a concrete action with ownership and a next checkpoint.",
        structuralRelevance:
          "Only when an evidence-backed answer becomes a concrete action does real impact emerge. This step makes visible how analysis turns into accountable execution.",
        visualSpec:
          "You see the direct path from answer to decision and from there to action. A final node marks the expected value in the next cycle.",
        keyInsight: "An evidence-backed answer only becomes valuable when it leads to a clear action.",
        keyTerms: ["Decision", "Action", "Ownership", "Execution path"],
        beforeAfter: {
          before: "One-off recommendation without follow-through",
          after: "Answer leads to decision and concrete action",
        },
        nextStepHint: "The demo shows this entire process live.",
        perspectiveCopy: {
          architecture:
            "Architecture: which technical decision is implemented concretely, and which dependencies must be managed actively?",
          product:
            "Product: which next steps are directly actionable, and how do we measure their effect in the next cycle?",
          governance:
            "Governance: who owns the action, when is it reviewed, and which criteria decide whether to continue or correct it?",
        },
      },
    ];
  }

  return [
  {
    id: "question",
    label: "Frage",
    goal: "Systemproblem formulieren",
    technicalFlow:
      "Wir machen aus der ersten Frage eine klare Kernfrage. Dazu benennen wir ausdrücklich Ziel, Grenze und erwartete Wirkung, damit alle vom gleichen Ausgangspunkt sprechen. Außerdem klären wir Begriffe, die unterschiedlich verstanden werden könnten, damit diese Unterschiede direkt am Anfang sichtbar sind und nicht erst später auftauchen.",
    structuralRelevance:
      "Wenn die Frage unklar bleibt, werden auch die späteren Antworten unklar oder widersprüchlich. Mit einem sauberen Fokus am Anfang vermeiden wir viele Missverständnisse im weiteren Verlauf. Genau hier entsteht die Basis für stabile Entscheidungen, weil der Entscheidungsraum nicht unterwegs unbemerkt wechselt.",
    visualSpec:
      "In der Mitte steht nur die Kernfrage. Der umgebende Raum zeigt, dass Annahmen vorhanden sind, aber noch nicht als feste Beziehungen modelliert wurden. Das Diagramm macht damit bewusst klar: Wir beginnen nicht mit Antworten, sondern mit einem präzisen gemeinsamen Verständnis.",
    keyInsight:
      "Gute Entscheidungen beginnen mit einer klaren Frage – nicht mit Daten.",
    keyTerms: ["Entscheidungsraum", "Problemknoten", "Implizite Annahmen", "Zielklärung"],
    beforeAfter: {
      before: "Vage Textanfrage an ein Modell",
      after: "Präziser Problemknoten mit Ziel und Grenze",
    },
    nextStepHint: "Mit der klaren Frage suchen wir relevanten Kontext.",
    perspectiveCopy: {
      architecture:
        "Architektur: Welche Systemgrenzen und Abhängigkeiten sind hier wirklich relevant, und was gehört bewusst nicht in diesen Entscheidungsraum? Diese Klärung verhindert, dass später technische Nebenthemen den eigentlichen Kern der Entscheidung überlagern.",
      product:
        "Produkt: Welche Wirkung für Nutzer und Geschäft soll diese Frage klären, und woran erkennen wir später, dass die Entscheidung geholfen hat? So bleibt von Anfang an klar, welche Ergebnisse am Ende wirklich zählen.",
      governance:
        "Governance: Welche Regeln, Nachweise und Risiken müssen wir von Anfang an mitdenken, damit die Entscheidung auch unter Prüfung Bestand hat? Damit wird früh sichtbar, welche Anforderungen nicht optional sind.",
    },
  },
  {
    id: "retrieval",
    label: "Kontextauswahl",
    goal: "Kontext priorisieren",
    technicalFlow:
      "Wir berechnen für mögliche Kontextknoten die Nähe zur Kernfrage über Embeddings und ordnen sie nach Graph-Score. Falls nötig erweitern wir die Auswahl über direkte Nachbarn per Hop. In den nächsten Schritt gehen nur diese priorisierten Knoten als Kontext für den LLM-Prompt.",
    structuralRelevance:
      "Mehr Kontext ist nicht automatisch besser, weil zu viel Material den Fokus verwässert. Die priorisierte Auswahl hält den Prompt präzise und macht den Auswahlweg reproduzierbar. So bleibt transparent, warum ein Knoten enthalten ist und ein anderer nicht.",
    visualSpec:
      "Du siehst ein zentriertes Kontextpaket mit den ausgewählten Knoten für den Prompt. Kontexte mit mittlerer und niedriger Relevanz liegen bewusst außen und bleiben sichtbar. Damit wird klar: ausgewählt wird nach Score und Hop-Regel, nicht nach Zufall.",
    keyInsight:
      "Nicht die Menge an Kontext zählt, sondern die Disziplin der Auswahl.",
    keyTerms: ["Embedding-Match", "Graph-Score", "Hop-Erweiterung", "Prompt-Kontext"],
    beforeAfter: {
      before: "Unstrukturierter Vollkontext im Prompt",
      after: "Score-basierte Knotenauswahl mit optionalem Hop",
    },
    nextStepHint: "Die priorisierten Knoten werden jetzt verknüpft.",
    perspectiveCopy: {
      architecture:
        "Architektur: Welche Quellen bringen wirklich Klarheit über Abhängigkeiten, und welche machen das Bild nur voller ohne zusätzliche Aussage? So vermeiden wir technische Überladung ohne echten Erkenntnisgewinn.",
      product:
        "Produkt: Welcher Kontext ändert tatsächlich unsere nächsten Schritte, und welcher ist nur interessant, aber nicht entscheidungsrelevant? Diese Unterscheidung schützt vor Aktionismus ohne Wirkung.",
      governance:
        "Governance: Welche Kontexte sind belastbar, aktuell und sauber dokumentiert, sodass Entscheidungen später transparent nachvollzogen werden können? Das schafft Sicherheit für Reviews und Audits.",
    },
  },
  {
    id: "graph",
    label: "Graph",
    goal: "Knoten für das LLM auswählen",
    technicalFlow:
      "Wir berechnen die semantische Nähe zwischen Kernfrage und Graph-Knoten über Embeddings. Danach wählen wir passende Konzeptknoten aus und nehmen die zugehörigen Belege mit. Falls nötig erweitern wir den Kontext um direkte Nachbarn über einen Hop. Genau dieses Teilnetz wird anschließend als strukturierter Kontext in den LLM-Prompt übergeben.",
    structuralRelevance:
      "Damit ist jederzeit klar, welche Knoten in den Prompt gelangen und warum. Der Kontext bleibt fokussiert statt beliebig groß und wird bei gleichen Eingaben reproduzierbar. So wird die Auswahl prüfbar und die Antwort stabiler.",
    visualSpec:
      "Die Visualisierung zeigt zuerst die Kernfrage, dann passende Konzepte, danach zugehörige Belege. Eine zusätzliche Kante markiert die optionale Hop-Erweiterung. Dadurch siehst du direkt, welche Knoten wirklich für den LLM-Kontext ausgewählt wurden.",
    keyInsight:
      "GraphRAG gewinnt Qualität durch nachvollziehbare Knotenauswahl, nicht durch mehr Text.",
    keyTerms: ["Embedding-Match", "Knotenauswahl", "Hop-Erweiterung", "Belegbezug"],
    beforeAfter: {
      before: "Ungefilterter Kontext für das LLM",
      after: "Embedding-basierte Knotenauswahl mit Belegen",
    },
    nextStepHint: "Aus dem Netz wird ein prüfbarer Ableitungspfad.",
    perspectiveCopy: {
      architecture:
        "Architektur: Welche Knoten und Kanten müssen in den Prompt, damit technische Abhängigkeiten korrekt abgebildet sind? So bleibt die Kontextbildung kontrollierbar und nachvollziehbar.",
      product:
        "Produkt: Welche Konzepte tragen wirklich zur Antwort bei, und welche bleiben bewusst außerhalb des Prompt-Kontexts? So bleibt die Antwort nah an der eigentlichen Produktfrage.",
      governance:
        "Governance: Ist dokumentiert, welche Knoten mit welchem Score ausgewählt wurden und welche über Hop hinzugekommen sind? Damit bleibt die Kontextauswahl auditierbar.",
    },
  },
  {
    id: "synthesis",
    label: "Synthese",
    goal: "Antwort herleiten",
    technicalFlow:
      "Wir geben das priorisierte Kontextpaket in den Prompt und lassen die Antwort entlang konkreter Knoten ableiten. Sichtbar bleibt der Pfad von der Frage über Kontext und Beleg bis zur Antwort. So ist klar, auf welche Belege sich die Aussage stützt.",
    structuralRelevance:
      "Eine reine Quellenliste reicht nicht, weil sie keine Begründungslogik zeigt. Der Ableitungspfad macht sichtbar, wie die Antwort zustande kommt und an welcher Stelle sie geprüft werden kann. Damit bleibt die Antwort nachvollziehbar statt nur plausibel formuliert.",
    visualSpec:
      "Du siehst einen klaren Pfad von Frage zu Antwort über Kontextpaket und Beleg. Damit wird sofort verständlich, was die finale Aussage fachlich trägt.",
    keyInsight:
      "Nachvollziehbarkeit entsteht durch den Ableitungspfad – nicht durch eine Quellenliste.",
    keyTerms: ["Kontextpaket", "Prompt-Kontext", "Belegpfad", "Nachvollziehbarkeit"],
    beforeAfter: {
      before: "Antwort mit angehängter Quellenliste",
      after: "Nachvollziehbarer Pfad: Frage → Kontext → Beleg → Antwort",
    },
    nextStepHint: "Die Herleitung wird zur operativen Entscheidung.",
    perspectiveCopy: {
      architecture:
        "Architektur: Ist die technische Entscheidung über mehrere Schritte hinweg konsistent, oder bricht die Begründung an einzelnen Kanten? So lassen sich technische Schwachstellen früh benennen.",
      product:
        "Produkt: Können wir die priorisierte Maßnahme so begründen, dass Priorisierung, Wirkung und Risiken gemeinsam verständlich sind? Das verbessert Entscheidungen über Teams und Rollen hinweg.",
      governance:
        "Governance: Kann ein Review die Schlussfolgerung nachvollziehen, ohne zusätzliches Insiderwissen oder mündliche Sondererklärung? Damit bleibt Qualität auch bei Personalwechsel stabil.",
    },
  },
  {
    id: "action",
    label: "Handlung",
    goal: "Nächste Schritte nutzen",
    technicalFlow:
      "Wir nehmen die Antwort aus dem vorherigen Schritt, die auf Fakten und Belegen basiert, und treffen daraus eine klare Entscheidung. Diese Entscheidung wird in eine konkrete Maßnahme mit klarer Verantwortlichkeit und nächstem Termin übersetzt. So geht der Weg ohne Bruch von der Herleitung in die Umsetzung.",
    structuralRelevance:
      "Erst wenn aus der belegten Antwort eine klare Maßnahme wird, entsteht tatsächliche Wirkung. Der Schritt macht transparent, wie aus faktenbasierter Analyse verbindliches Handeln wird. Das reduziert Interpretationsspielraum und beschleunigt die Umsetzung.",
    visualSpec:
      "Du siehst den direkten Pfad von Antwort zu Entscheidung und von dort zur Maßnahme. Ein letzter Knoten markiert den erwarteten Mehrwert im nächsten Zyklus. Dadurch ist klar erkennbar, wie die Herleitung in konkretes Handeln übergeht.",
    keyInsight:
      "Eine belegte Antwort ist erst dann wertvoll, wenn daraus eine klare Maßnahme folgt.",
    keyTerms: ["Entscheidung", "Maßnahme", "Verantwortung", "Umsetzungspfad"],
    beforeAfter: {
      before: "Einmalige Empfehlung ohne Nachvollzug",
      after: "Antwort führt zu Entscheidung und konkreter Maßnahme",
    },
    nextStepHint: "Die Demo zeigt diesen gesamten Prozess live.",
    perspectiveCopy: {
      architecture:
        "Architektur: Welche technische Entscheidung wird konkret umgesetzt, und welche Abhängigkeiten müssen dafür aktiv gemanagt werden? So bleibt Architekturarbeit handlungsorientiert.",
      product:
        "Produkt: Welche nächsten Schritte sind direkt umsetzbar, und wie messen wir ihren Effekt im nächsten Zyklus? So bleibt die Umsetzung handlungsfähig und lernorientiert.",
      governance:
        "Governance: Wer verantwortet die Maßnahme, wann wird überprüft, und welche Kriterien entscheiden über Fortführung oder Korrektur? Damit bleiben Verantwortung und Nachweisführung klar verteilt.",
    },
  },
  ];
}

export function getPrimaryActionForChapter(
  chapterIndex: number,
  chapterCount = STORY_CHAPTERS.length,
  locale: "de" | "en" = "de",
): StoryPrimaryAction {
  if (chapterIndex >= chapterCount - 1) {
    return { label: locale === "en" ? "Open demo" : "Zur Demo", isDemoLink: true };
  }

  return { label: locale === "en" ? "Next" : "Weiter", isDemoLink: false };
}

export const STORY_PERSPECTIVES = getStoryPerspectives("de");
export const STORY_CHAPTERS = getStoryChapters("de");
