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
  label: "Weiter" | "Zur Demo";
  isDemoLink: boolean;
};

export const STORY_PERSPECTIVES: Array<{ id: StoryPerspective; label: string }> = [
  { id: "architecture", label: "Architektur" },
  { id: "product", label: "Produkt" },
  { id: "governance", label: "Governance" },
];

export const STORY_CHAPTERS: StoryChapter[] = [
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
      "Wir markieren einen klaren Pfad von der Frage bis zur Schlussfolgerung. Dieser Pfad zeigt in welcher Reihenfolge Begriffe, Beziehungen und Belege zur Antwort führen. Zusätzlich sehen wir, welche alternativen Pfade möglich wären und warum der Hauptpfad für diese Entscheidung bevorzugt wurde.",
    structuralRelevance:
      "Eine reine Quellenliste reicht nicht, weil sie keine Begründungslogik zeigt. Der Pfad macht sichtbar, wie die Antwort zustande kommt und an welcher Stelle sie überprüft werden kann. Genau dadurch kann das Team Fehler schneller finden und Annahmen sauber korrigieren.",
    visualSpec:
      "Ein Hauptpfad ist klar hervorgehoben, damit die zentrale Herleitung sofort erkennbar ist. Andere Pfade bleiben sichtbar im Hintergrund und zeigen mögliche Alternativen. Das Diagramm hilft dadurch sowohl bei Entscheidungen als auch bei späteren Review-Gesprächen.",
    keyInsight:
      "Nachvollziehbarkeit entsteht durch den Ableitungspfad – nicht durch eine Quellenliste.",
    keyTerms: ["Ableitungspfad", "Auditierbarkeit", "Herleitung", "Alternativpfade"],
    beforeAfter: {
      before: "Antwort mit angehängter Quellenliste",
      after: "Nachvollziehbarer Pfad: Frage → Schluss",
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
      "Wir machen aus der Schlussfolgerung einen konkreten nächsten Schritt mit klarer Verantwortlichkeit. Gleichzeitig bleiben frühere Versionen und alternative Pfade sichtbar. So kann das Team bei neuen Informationen gezielt nachsteuern, ohne den gesamten Entscheidungsweg neu aufzubauen.",
    structuralRelevance:
      "So bleibt die Entscheidung auch bei Änderungen stabil und überprüfbar. Das Team kann sehen, was sich geändert hat und warum die Kernaussage gleich geblieben oder bewusst angepasst wurde. Diese Transparenz stärkt Vertrauen im Alltag und in formalen Freigaben.",
    visualSpec:
      "Du siehst den aktuellen Entscheidungsstand, frühere Versionen und mögliche Alternativen im direkten Vergleich. Dadurch wird aus einer Antwort ein steuerbarer Entscheidungsprozess. Das Diagramm zeigt, dass Entscheidungen nicht statisch sind, sondern kontrolliert weiterentwickelt werden können.",
    keyInsight:
      "Gute Entscheidungen halten bei Veränderungen stand – Versionierung macht das prüfbar.",
    keyTerms: ["Versionierung", "Entscheidungszustand", "Pfadstabilität", "Vergleichbarkeit"],
    beforeAfter: {
      before: "Einmalige Empfehlung ohne Nachvollzug",
      after: "Versionierter Entscheidungszustand mit Alternativen",
    },
    nextStepHint: "Die Demo zeigt diesen gesamten Prozess live.",
    perspectiveCopy: {
      architecture:
        "Architektur: Bleibt die Entscheidung auch bei Architekturänderungen nachvollziehbar, und welche Teile müssen dann neu bewertet werden? So bleibt die technische Linie trotz Änderungen stabil.",
      product:
        "Produkt: Welche nächsten Schritte sind direkt umsetzbar, und wie messen wir ihren Effekt im nächsten Zyklus? So bleibt das Produktteam handlungsfähig und lernorientiert.",
      governance:
        "Governance: Welche Version ist freigegeben, was ist abgewichen, und welche nächste Prüfung oder Eskalation ist vorgesehen? Damit bleiben Verantwortung und Nachweisführung klar verteilt.",
    },
  },
];

export function getPrimaryActionForChapter(chapterIndex: number): StoryPrimaryAction {
  if (chapterIndex >= STORY_CHAPTERS.length - 1) {
    return { label: "Zur Demo", isDemoLink: true };
  }

  return { label: "Weiter", isDemoLink: false };
}
