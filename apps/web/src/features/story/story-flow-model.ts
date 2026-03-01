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
      "Wir sammeln mögliche Kontexte und ordnen sie nach Relevanz für die Kernfrage. In den nächsten Schritt gehen nur die Informationen, die den Entscheidungsweg tatsächlich tragen. Alles andere bleibt sichtbar, wird aber bewusst zurückgestellt, damit das Team den Fokus nicht verliert.",
    structuralRelevance:
      "Mehr Kontext ist nicht automatisch besser, weil zu viel Material den Blick auf das Wesentliche verdeckt. Eine klare Auswahl macht die folgenden Schritte stabiler und leichter prüfbar. Sie sorgt außerdem dafür, dass ähnliche Fragen später mit einer vergleichbaren Logik beantwortet werden können.",
    visualSpec:
      "Du siehst mehrere Kontexte mit unterschiedlichem Gewicht. Wichtiges steht sichtbar im Vordergrund, weniger Relevantes bleibt vorhanden, aber bewusst zurückgenommen. Das Diagramm zeigt damit nicht nur Auswahl, sondern auch Priorität und Begründung der Auswahl.",
    keyInsight:
      "Nicht die Menge an Kontext zählt, sondern die Disziplin der Auswahl.",
    keyTerms: ["Kontextdisziplin", "Relevanzgewichtung", "Rauschreduktion", "Priorisierung"],
    beforeAfter: {
      before: "Alle verfügbaren Dokumente im Kontext",
      after: "Gewichtete, priorisierte Kontextauswahl",
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
    goal: "Knoten verknüpfen",
    technicalFlow:
      "Jetzt verbinden wir die Begriffe zu einem gemeinsamen Modell. Jede Verbindung bekommt einen klaren Typ, zum Beispiel Ursache, Zielkonflikt oder Belegbezug. Dadurch wird aus einer Sammlung von Informationen ein strukturiertes Netz, das sich gemeinsam bearbeiten und weiterentwickeln lässt.",
    structuralRelevance:
      "Erst mit klar typisierten Verbindungen werden Abhängigkeiten und Nebenwirkungen sichtbar. Dadurch wird die Diskussion im Team konkreter, weil Aussagen direkt auf Struktur statt auf Bauchgefühl bezogen werden. Gleichzeitig sinkt das Risiko, dass unterschiedliche Teams am selben Thema vorbeireden.",
    visualSpec:
      "Aus einzelnen Punkten wird ein klares Netz mit unterschiedlichen Beziehungstypen. So ist auf einen Blick erkennbar, was Ursache ist, wo Zielkonflikte liegen und welche Teile mit Belegen gestützt sind. Das Diagramm macht sichtbar, wie eng fachliche und technische Entscheidungen miteinander verbunden sind.",
    keyInsight:
      "Explizite Beziehungen machen Abhängigkeiten und Trade-offs im Team besprechbar.",
    keyTerms: ["Beziehungstypen", "Ursache-Wirkung", "Trade-off", "Evidenzbezug"],
    beforeAfter: {
      before: "Isolierte Konzepte ohne Beziehungen",
      after: "Typisiertes Beziehungsmodell mit Kanten",
    },
    nextStepHint: "Aus dem Netz wird ein prüfbarer Ableitungspfad.",
    perspectiveCopy: {
      architecture:
        "Architektur: Wo entstehen Ursache-Wirkung-Ketten zwischen Komponenten oder Domänen, und wo entstehen Kopplungen mit hoher Folgewirkung? Diese Sicht hilft, Risiken nicht erst im Betrieb zu entdecken.",
      product:
        "Produkt: Welche Entscheidung verbessert einen Pfad, macht aber einen anderen schlechter, und welche Trade-offs sind dabei akzeptabel? So wird Priorisierung transparent statt intuitiv.",
      governance:
        "Governance: Welche Beziehungstypen brauchen Freigaben, Kontrollen oder dokumentierte Ausnahmen, damit Entscheidungen sauber geführt werden? So bleibt Steuerung nachvollziehbar und nicht personengebunden.",
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
